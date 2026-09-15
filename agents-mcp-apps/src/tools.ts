import { CallToolResult, McpServer, ServerContext } from "@modelcontextprotocol/server";
import { z } from "zod";

export const MCP_TOOL_SCOPES = ["tool:add", "tool:calculate"];

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
    server.registerTool(
        "add",
        { inputSchema: z.object({ a: z.number(), b: z.number() }) },
        requireScopes(["tool:add"], async ({ a, b }) => ({
            content: [{ type: "text", text: String(a + b) }],
        })),
    );

    server.registerTool(
        "calculate",
        {
            inputSchema: z.object({
                operation: z.enum(["add", "subtract", "multiply", "divide"]),
                a: z.number(),
                b: z.number(),
            }),
        },
        requireScopes(["tool:calculate"], async ({ operation, a, b }) => {
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
                        };
                    result = a / b;
                    break;
            }
            return { content: [{ type: "text", text: String(result) }] };
        }),
    );
}
