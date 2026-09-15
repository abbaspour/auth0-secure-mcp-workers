goal: build

build:
	npm run build

deploy:
	npm run deploy

type-check: compile

compile:
	npm run type-check

log:
	wrangler tail agents-mcp-apps

oauth-protected-resource:
	curl -s https://agents-mcp-apps.abbaspour.workers.dev/.well-known/oauth-protected-resource | jq .

client-metadata:
	curl -s https://agents-mcp-apps.abbaspour.workers.dev/client-metadata.json | jq .

