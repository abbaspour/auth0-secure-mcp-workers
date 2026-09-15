goal: inspect

inspect:
	BROWSER="firefox" npx -y @modelcontextprotocol/inspector --config mcp.json

claude-desktop:
	gvim ~/Library/Application\ Support/Claude-3p/claude_desktop_config.json

log:
	# cd ~/.mcp-inspector
	# tail -f auth.log

mcpjam:
	npx @mcpjam/inspector@latest