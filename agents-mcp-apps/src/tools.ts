import {CallToolResult, McpServer, ServerContext} from "@modelcontextprotocol/server";
import {registerAppResource, registerAppTool, RESOURCE_MIME_TYPE} from "@modelcontextprotocol/ext-apps/server";
import {z} from "zod";
import sumHtml from "../dist-ui/sum/mcp-app.html";
import calculatorHtml from "../dist-ui/calculator/mcp-app.html";

export const MCP_TOOL_SCOPES = ["tool:add", "tool:calculate"];

const SUM_URI = "ui://sum/mcp-app.html";
const CALCULATOR_URI = "ui://calculator/mcp-app.html";

function requireScopes<Args>(
    requiredScopes: readonly string[],
    handler: (args: Args, ctx: ServerContext) => CallToolResult | Promise<CallToolResult>,
) {
    return async (args: Args, ctx: ServerContext): Promise<CallToolResult> => {
        const authInfo = ctx.http?.authInfo;
        if (!authInfo) {
            throw new Error("Authentication information is required to execute this tool.");
        }

        const hasScopes = requiredScopes.every((scope) => authInfo.scopes.includes(scope));
        if (!hasScopes) {
            throw new Error(`Missing required scopes: ${requiredScopes.join(", ")}`);
        }

        return handler(args, ctx);
    };
}

export function registerTools(server: McpServer) {
    registerAppTool(
        server,
        "add",
        {
            inputSchema: z.object({a: z.number(), b: z.number()}),
            _meta: {ui: {resourceUri: SUM_URI}},
        },
        requireScopes(["tool:add"], async ({a, b}) => {
            const sum = a + b;
            return {
                content: [{type: "text", text: String(sum)}],
                structuredContent: {sum},
            };
        }),
    );

    registerAppTool(
        server,
        "calculate",
        {
            inputSchema: z.object({
                operation: z.enum(["add", "subtract", "multiply", "divide"]),
                a: z.number(),
                b: z.number(),
            }),
            _meta: {ui: {resourceUri: CALCULATOR_URI}},
        },
        requireScopes(["tool:calculate"], async ({operation, a, b}) => {
            let result: number;
            switch (operation) {
                case "add":
                    result = a + b;
                    break;
                case "subtract":
                    result = a - b;
                    break;
                case "multiply":
                    result = a * b;
                    break;
                case "divide":
                    if (b === 0)
                        return {
                            content: [
                                {
                                    type: "text",
                                    text: "Error: Cannot divide by zero",
                                },
                            ],
                            isError: true,
                        };
                    result = a / b;
                    break;
            }
            return {
                content: [{type: "text", text: String(result)}],
                structuredContent: {result},
            };
        }),
    );

    registerAppResource(server, "Sum UI", SUM_URI, {}, async () => ({
        contents: [
            {
                uri: SUM_URI,
                mimeType: RESOURCE_MIME_TYPE,
                text: sumHtml,
                _meta: {
                    ui: {
                        csp: {
                            connectDomains: ["https://agents-mcp-apps.abbaspour.workers.dev"],
                        }, prefersBorder: true
                    }
                },
            },
        ],
    }));

    registerAppResource(server, "Calculator UI", CALCULATOR_URI, {}, async () => ({
        contents: [
            {
                uri: CALCULATOR_URI,
                mimeType: RESOURCE_MIME_TYPE,
                text: calculatorHtml,
                _meta: {
                    ui: {
                        csp: {
                            connectDomains: ["https://agents-mcp-apps.abbaspour.workers.dev"],
                        }, prefersBorder: true
                    }
                },
            },
        ],
    }));
}
