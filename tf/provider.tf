terraform {
  required_providers {
    auth0 = {
      source  = "auth0/auth0"
      version = "~> 1.57"
    }
  }
  required_version = ">= 1.0.0"
}

provider "auth0" {
  domain        = var.auth0_domain
  client_id     = var.auth0_tf_client_id
  client_secret = var.auth0_tf_client_secret
}