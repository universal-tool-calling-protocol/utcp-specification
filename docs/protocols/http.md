---
id: http
title: HTTP Protocol
sidebar_position: 1
---

# HTTP Protocol

The HTTP protocol plugin (`utcp-http`) enables UTCP to call REST APIs, webhooks, and any HTTP-based services. It's the most commonly used protocol and provides comprehensive support for modern web APIs.

## Installation

```bash
pip install utcp-http
```

## Call Template Structure

```json
{
  "call_template_type": "http",
  "url": "https://api.example.com/endpoint",
  "http_method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer ${API_TOKEN}"
  },
  "body": {
    "query": "${query}",
    "limit": 10
  },
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "X-API-Key",
    "location": "header"
  }
}
```

## Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `call_template_type` | string | Must be `"http"` |
| `url` | string | The HTTP endpoint URL |
| `http_method` | string | HTTP method (GET, POST, PUT, DELETE, etc.) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `headers` | object | HTTP headers to include |
| `body` | object/string | Request body for POST/PUT requests |
| `query_params` | object | URL query parameters |
| `timeout` | number | Request timeout in seconds (default: 30) |
| `follow_redirects` | boolean | Whether to follow HTTP redirects (default: true) |
| `verify_ssl` | boolean | Whether to verify SSL certificates (default: true) |

## Authentication

The HTTP protocol supports multiple authentication methods:

### API Key Authentication

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "X-API-Key",
    "location": "header"
  }
}
```

**Locations:**
- `"header"`: Add as HTTP header
- `"query"`: Add as query parameter
- `"cookie"`: Add as cookie

### Basic Authentication

```json
{
  "auth": {
    "auth_type": "basic",
    "username": "${USERNAME}",
    "password": "${PASSWORD}"
  }
}
```

### OAuth2 Bearer Token

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "read:data"
  }
}
```

## Variable Substitution

Use `${VARIABLE_NAME}` syntax to substitute values at runtime:

```json
{
  "url": "https://api.example.com/users/${user_id}",
  "headers": {
    "Authorization": "Bearer ${access_token}"
  },
  "body": {
    "name": "${user_name}",
    "email": "${user_email}"
  }
}
```

Variables can come from:
- Tool arguments
- Environment variables
- Configuration files
- Runtime context

## Examples

### Simple GET Request

```json
{
  "name": "get_weather",
  "description": "Get current weather for a location",
  "inputs": {
    "type": "object",
    "properties": {
      "location": {"type": "string"}
    },
    "required": ["location"]
  },
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.weather.com/v1/current",
    "http_method": "GET",
    "query_params": {
      "q": "${location}",
      "appid": "${WEATHER_API_KEY}"
    }
  }
}
```

### POST with JSON Body

```json
{
  "name": "create_user",
  "description": "Create a new user account",
  "inputs": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "email": {"type": "string"}
    },
    "required": ["name", "email"]
  },
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/users",
    "http_method": "POST",
    "headers": {
      "Content-Type": "application/json",
      "Authorization": "Bearer ${ACCESS_TOKEN}"
    },
    "body": {
      "name": "${name}",
      "email": "${email}",
      "created_at": "{{now}}"
    }
  }
}
```

### File Upload

```json
{
  "name": "upload_file",
  "description": "Upload a file to the server",
  "inputs": {
    "type": "object",
    "properties": {
      "file_path": {"type": "string"},
      "description": {"type": "string"}
    },
    "required": ["file_path"]
  },
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/upload",
    "http_method": "POST",
    "headers": {
      "Authorization": "Bearer ${ACCESS_TOKEN}"
    },
    "body": {
      "file": "@${file_path}",
      "description": "${description}"
    }
  }
}
```

## Error Handling

The HTTP protocol handles various error conditions:

| HTTP Status | Behavior |
|-------------|----------|
| 200-299 | Success - return response body |
| 400-499 | Client error - raise `HttpClientError` |
| 500-599 | Server error - raise `HttpServerError` |
| Timeout | Raise `HttpTimeoutError` |
| Connection | Raise `HttpConnectionError` |

## Best Practices

1. **Use HTTPS**: Always use secure connections for production APIs
2. **Set Timeouts**: Configure appropriate timeouts for your use case
3. **Handle Rate Limits**: Implement retry logic for rate-limited APIs
4. **Validate Inputs**: Use JSON Schema to validate tool inputs
5. **Secure Credentials**: Store API keys and tokens securely
6. **Monitor Usage**: Track API usage and performance metrics

## OpenAPI Integration

The HTTP protocol can automatically generate UTCP manuals from OpenAPI specifications:

```python
from utcp_http.openapi_converter import OpenApiConverter

converter = OpenApiConverter()
manual = await converter.convert_openapi_to_manual(
    "https://api.example.com/openapi.json"
)
```

## Related Protocols

- [Server-Sent Events](./sse.md) - For streaming HTTP responses
- [Streamable HTTP](./streamable-http.md) - For chunked HTTP responses
- [WebSocket](./websocket.md) - For bidirectional real-time communication
