variable "auth0_domain" {
  description = "Auth0 domain"
  type        = string
}

variable "auth0_tf_client_id" {
  description = "Auth0 Terraform client ID"
  type        = string
}

variable "auth0_tf_client_secret" {
  description = "Auth0 Terraform client secret"
  type        = string
  sensitive   = true
}

variable "agents_test_client_secret" {
  description = "Temporary client_secret for the agents-mcp-worker test client (write-only, not persisted in state)"
  type        = string
  sensitive   = true
  ephemeral   = true
}

