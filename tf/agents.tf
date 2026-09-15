
resource "auth0_resource_server" "agents" {
  identifier = "https://agents-mcp-worker.abbaspour.workers.dev/"
  name       = "agents mcp api"
}

resource "auth0_resource_server_scopes" "agents" {

  resource_server_identifier = auth0_resource_server.agents.identifier

  scopes {
    name        = "tool:add"
    description = "tool:add"
  }

  scopes {
    name        = "tool:calculate"
    description = "tool:calculate"
  }
}

resource "auth0_client" "agents_test" {
  name     = "agents mcp worker test client"
  app_type = "non_interactive"
}

resource "auth0_client_grant" "agents_test" {
  client_id = auth0_client.agents_test.client_id
  audience  = auth0_resource_server.agents.identifier
  scopes    = ["tool:add", "tool:calculate"]
}

resource "auth0_client_credentials" "agents_test" {
  client_id                = auth0_client.agents_test.client_id
  authentication_method    = "client_secret_post"
  client_secret_wo         = var.agents_test_client_secret
  client_secret_wo_version = 1
}
