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

resource "auth0_client_cimd" "agents" {
  external_client_id = "https://agents-mcp-worker.abbaspour.workers.dev/client-metadata.json"
}

resource "auth0_client_grant" "agents" {
  default_for      = "third_party_clients"
  audience         = auth0_resource_server.agents.identifier
  subject_type     = "user"
  allow_all_scopes = true
}
