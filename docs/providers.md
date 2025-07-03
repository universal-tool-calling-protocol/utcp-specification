---
title: Provider Types
layout: default
nav_order: 4
has_children: true
permalink: /docs/providers
---

# Provider Types

Providers are at the heart of UTCP's flexibility. They define the specific communication protocol and configuration needed to interact with a tool. This design allows UTCP to support a wide range of existing and future communication methods.

## Overview

Each tool in UTCP is associated with a provider that specifies:
- The communication protocol to use (HTTP, WebSocket, CLI, etc.)
- The connection details (URL, host, port, command name, etc.)
- Authentication requirements (if any)

This provider-based approach offers several benefits:
- Eliminates the need for middleman servers
- Allows direct use of a tool's native interface
- Enables seamless integration with tools across different protocols

## Core Provider Attributes

All providers share some common attributes:

```json
{
  "name": "provider_name",
  "provider_type": "provider_type",
  ... (protocol-specific attributes)
}
```

| Field | Description |
|-------|-------------|
| `name` | A unique identifier for the provider |
| `provider_type` | The protocol type (e.g., "http", "websocket", "cli") |

## Supported Provider Types

UTCP supports the following provider types:

| Provider Type | Description |
|---------------|-------------|
| [`http`](providers/http) | RESTful HTTP/HTTPS APIs |
| [`sse (WIP)`](providers/sse) | Server-Sent Events |
| [`http_stream (WIP)`](providers/http-stream) | HTTP Chunked Transfer Encoding |
| [`cli (WIP)`](providers/cli) | Command Line Interface tools |
| [`websocket (WIP)`](providers/websocket) | WebSocket bidirectional connection |
| [`grpc (WIP)`](providers/grpc) | gRPC (Google Remote Procedure Call) |
| [`graphql (WIP)`](providers/graphql) | GraphQL query language |
| [`tcp (WIP)`](providers/tcp) | Raw TCP socket |
| [`udp (WIP)`](providers/udp) | User Datagram Protocol |
| [`webrtc (WIP)`](providers/webrtc) | Web Real-Time Communication |
| [`mcp (WIP)`](providers/mcp) | Model Context Protocol (for interoperability) |
| [`text (WIP)`](providers/text) | Local file-based tool definitions |

Each provider type has its own specific configuration options, which are detailed in the individual provider documentation pages.

## Variable Substitution

UTCP supports variable substitution in provider configurations. Any value prefixed with `$` or enclosed in `${...}` will be treated as a variable to be resolved at runtime.

```json
{
  "url": "https://${DOMAIN}/api/v1",
  "auth": {
    "auth_type": "api_key",
    "api_key": "$API_KEY"
  }
}
```

Variable resolution follows this order:
1. Client configuration variables
2. Environment variables

If a variable cannot be resolved, the client will raise an error indicating which variable is missing.

This approach enables:
- Secure handling of sensitive credentials
- Environment-specific configurations
- Separation of provider definition from runtime secrets

## Authentication

Many providers require authentication to access their tools. UTCP supports several authentication methods:

### API Key Authentication

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "X-API-Key"
  }
}
```

### Basic Authentication

```json
{
  "auth": {
    "auth_type": "basic",
    "username": "user",
    "password": "pass"
  }
}
```

### OAuth2 Authentication

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "$YOUR_CLIENT_ID",
    "client_secret": "$YOUR_CLIENT_SECRET",
    "token_url": "https://auth.example.com/token"
  }
}
```

## Provider Selection Guidelines

When choosing a provider type for your tool:

1. **Use the native protocol**: Select the provider type that matches your tool's native interface
2. **Consider performance**: Some protocols (like HTTP) have more overhead than others (like gRPC)
3. **Think about streaming**: For tools that generate data incrementally, use streaming protocols like SSE, WebSockets, or HTTP Stream
4. **Security requirements**: Consider authentication and encryption needs

In the following sections, we'll explore each provider type in detail, with configuration examples and best practices.
