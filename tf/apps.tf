resource "auth0_resource_server" "agents-apps" {
  identifier = "https://agents-mcp-apps.abbaspour.workers.dev/"
  name       = "agents mcp apps api"
}

resource "auth0_resource_server_scopes" "agents-apps" {

  resource_server_identifier = auth0_resource_server.agents-apps.identifier

  scopes {
    name        = "tool:add"
    description = "tool:add"
  }

  scopes {
    name        = "tool:calculate"
    description = "tool:calculate"
  }
}


resource "auth0_client_cimd" "agents-apps" {
  external_client_id = "https://agents-mcp-apps.abbaspour.workers.dev/client-metadata.json"
}

resource "auth0_client_grant" "agents-apps" {
  default_for      = "third_party_clients"
  audience         = auth0_resource_server.agents-apps.identifier
  subject_type     = "user"
  allow_all_scopes = true
}
