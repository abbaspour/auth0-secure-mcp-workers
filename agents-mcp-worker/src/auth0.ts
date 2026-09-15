import { createRemoteJWKSet, jwtVerify } from "jose";
import {
    AuthInfo,
    OAuthError,
    OAuthErrorCode,
    OAuthMetadata,
    OAuthTokenVerifier,
} from "@modelcontextprotocol/server";

export interface Auth0Options {
    domain: string;
    audience: string;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.length > 0;
}

export function createAuth0TokenVerifier({ domain, audience }: Auth0Options): OAuthTokenVerifier {
    const issuer = `https://${domain}/`;
    const jwks = createRemoteJWKSet(new URL(`https://${domain}/.well-known/jwks.json`));

    return {
        async verifyAccessToken(token: string): Promise<AuthInfo> {
            let payload;
            try {
                ({ payload } = await jwtVerify(token, jwks, {
                    issuer,
                    audience,
                    algorithms: ["RS256"],
                }));
            } catch (error) {
                const message = error instanceof Error ? error.message : "Invalid access token";
                throw new OAuthError(OAuthErrorCode.InvalidToken, message);
            }

            if (!isNonEmptyString(payload.sub)) {
                throw new OAuthError(OAuthErrorCode.InvalidToken, "Token is missing required subject (sub) claim.");
            }

            const clientId = isNonEmptyString(payload.client_id)
                ? payload.client_id
                : isNonEmptyString(payload.azp)
                    ? payload.azp
                    : null;

            if (!clientId) {
                throw new OAuthError(
                    OAuthErrorCode.InvalidToken,
                    "Token is missing required client identification (client_id or azp claim).",
                );
            }

            if (!payload.exp) {
                throw new OAuthError(OAuthErrorCode.InvalidToken, "Token is missing required exp claim.");
            }

            return {
                token,
                clientId,
                scopes: typeof payload.scope === "string" ? payload.scope.split(" ").filter(Boolean) : [],
                expiresAt: payload.exp,
                extra: {
                    sub: payload.sub,
                    ...(isNonEmptyString(payload.name) && { name: payload.name }),
                    ...(isNonEmptyString(payload.email) && { email: payload.email }),
                },
            };
        },
    };
}

export function buildAuth0OAuthMetadata({ domain }: { domain: string }): OAuthMetadata {
    return {
        issuer: `https://${domain}/`,
        authorization_endpoint: `https://${domain}/authorize`,
        token_endpoint: `https://${domain}/oauth/token`,
        response_types_supported: ["code"],
    };
}
