import { createMcpHandler } from "agents/mcp/server";
import { McpServer, getOAuthProtectedResourceMetadataUrl, oauthMetadataResponse, requireBearerAuth } from "@modelcontextprotocol/server";
import { buildAuth0OAuthMetadata, createAuth0TokenVerifier } from "./auth0";
import { MCP_TOOL_SCOPES, registerTools } from "./tools";

function createServer() {
    const server = new McpServer({
        name: "Agents MCP Apps Server",
        version: "1.0.0",
    });

    registerTools(server);

    return server;
}

const handler = createMcpHandler(createServer);

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const resourceServerUrl = new URL(env.MCP_SERVER_URL);

        if (request.method === "GET" && new URL(request.url).pathname === "/client-metadata.json") {
            return Response.json({
                client_id: `${env.MCP_SERVER_URL}/client-metadata.json`,
                client_name: "Agents MCP Apps Server",
                redirect_uris: [
                    "https://agents-mcp-apps.abbaspour.workers.dev/callback",
                    "http://local.abbaspour.net:1980/cgi-bin/cb.sh",
                    "http://localhost:3000/callback",
                    "http://127.0.0.1:3000/callback",
                ],
                grant_types: ["authorization_code"],
                response_types: ["code"],
                token_endpoint_auth_method: "none",
            });
        }

        const metadataResponse = oauthMetadataResponse(request, {
            oauthMetadata: buildAuth0OAuthMetadata({ domain: env.AUTH0_DOMAIN }),
            resourceServerUrl,
            scopesSupported: MCP_TOOL_SCOPES,
            resourceName: "Agents MCP Apps Server",
        });
        if (metadataResponse) return metadataResponse;

        if (request.method === "OPTIONS" || new URL(request.url).pathname !== "/mcp") {
            return handler.fetch(request);
        }

        const gate = requireBearerAuth({
            verifier: createAuth0TokenVerifier({ domain: env.AUTH0_DOMAIN, audience: env.AUTH0_AUDIENCE }),
            resourceMetadataUrl: getOAuthProtectedResourceMetadataUrl(resourceServerUrl),
        });
        const authInfo = await gate(request);
        if (authInfo instanceof Response) return authInfo;

        return handler.fetch(request, { authInfo });
    },
} satisfies ExportedHandler<Env>;
