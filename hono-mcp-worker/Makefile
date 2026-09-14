goal: build

build:
	npm run build

deploy:
	npm run deploy

log:
	wrangler tail hono-mcp-worker

oauth-protected-resource:
	curl -s https://hono-mcp-worker.abbaspour.workers.dev/.well-known/oauth-protected-resource | jq .

client-metadata:
	curl -s https://hono-mcp-worker.abbaspour.workers.dev/client-metadata.json | jq .

