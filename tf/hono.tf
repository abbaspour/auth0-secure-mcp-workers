
resource "auth0_resource_server" "hono" {
  identifier = "https://hono-mcp-worker.abbaspour.workers.dev/"
  name       = "hono mcp api"
}

resource "auth0_client_grant" "my_client_grant" {
  default_for      = "third_party_clients"
  audience         = auth0_resource_server.hono.identifier
  subject_type     = "user"
  allow_all_scopes = true
}

resource "auth0_resource_server_scopes" "hono" {

  resource_server_identifier = auth0_resource_server.hono.identifier

  scopes {
    name        = "tool:greet"
    description = "tool:greet"
  }

  scopes {
    name        = "tool:whoami"
    description = "tool:whoami"
  }
}

resource "auth0_client_cimd" "hono" {
  external_client_id = "https://hono-mcp-worker.abbaspour.workers.dev/client-metadata.json"
}
