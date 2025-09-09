---
id: http
title: HTTP Protocol
sidebar_position: 1
---

# HTTP Protocol Plugin

The HTTP protocol plugin enables UTCP to call tools via HTTP/HTTPS requests. This is the most commonly used protocol for REST APIs, webhooks, and web services.

## Call Template Structure

```json
{
  "call_template_type": "http",
  "url": "https://api.example.com/users/{user_id}",
  "http_method": "GET|POST|PUT|DELETE|PATCH",
  "content_type": "application/json",
  "headers": {
    "X-Custom-Header": "static_value"
  },
  "body_field": "body",
  "header_fields": ["user_agent", "request_id"],
  "auth": {
    "auth_type": "api_key|basic|oauth2",
    "api_key": "${API_KEY}",
    "var_name": "Authorization", 
    "location": "header|query|cookie"
  }
}
```

### Field Descriptions

For detailed field descriptions, examples, and implementation details, see:
- **[HttpCallTemplate API Reference](../api/plugins/communication_protocols/http/src/utcp_http/http_call_template.md)** - Complete field documentation with examples
- **[HttpCommunicationProtocol API Reference](../api/plugins/communication_protocols/http/src/utcp_http/http_communication_protocol.md)** - Implementation details and method documentation

## Supported HTTP Methods

| Method | Use Case | Body Support |
|--------|----------|--------------|
| `GET` | Retrieve data | No |
| `POST` | Create resources, submit data | Yes |
| `PUT` | Update/replace resources | Yes |
| `PATCH` | Partial updates | Yes |
| `DELETE` | Remove resources | Optional |

## Authentication Methods

### API Key Authentication
```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "X-API-Key",
    "location": "header|query|cookie"
  }
}
```

Supported locations:
- `"header"`: API key sent as HTTP header
- `"query"`: API key sent as query parameter  
- `"cookie"`: API key sent as HTTP cookie

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

### OAuth2 Authentication
```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "read write"
  }
}
```

## Parameter Handling

The HTTP protocol handles tool arguments in a hierarchical manner:

1. **URL Path Parameters**: Arguments matching `{param_name}` in the URL are substituted directly
2. **Body Field**: If `body_field` is specified, that argument becomes the request body
3. **Header Fields**: Arguments listed in `header_fields` become request headers
4. **Query Parameters**: All remaining arguments become query parameters

### URL Path Parameters
URL templates can include path parameters using `{parameter_name}` syntax:

```json
{
  "url": "https://api.example.com/users/{user_id}/posts/{post_id}"
}
```

When calling a tool with arguments `{"user_id": "123", "post_id": "456", "limit": "10"}`, the URL becomes:
`https://api.example.com/users/123/posts/456?limit=10`

### Body Field Mapping
Specify which tool argument should be sent as the request body:

```json
{
  "body_field": "data",
  "content_type": "application/json"
}
```

### Header Field Mapping  
Map specific tool arguments to HTTP headers:

```json
{
  "header_fields": ["user_agent", "request_id"]
}
```

Tool arguments `user_agent` and `request_id` will be sent as HTTP headers.

### Variable Substitution in Authentication
Authentication fields support environment variable substitution:

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "Bearer ${API_KEY}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

## OpenAPI Integration

The HTTP communication protocol automatically detects and converts OpenAPI/Swagger specifications to UTCP manuals:

### Automatic Detection
When registering an HTTP provider, the protocol:
1. Fetches content from the specified URL
2. Checks if the response contains `utcp_version` and `tools` fields (UTCP manual)
3. If not, assumes it's an OpenAPI specification and converts it automatically

### Conversion Process
The `OpenApiConverter` handles:
- **Path Mapping**: OpenAPI paths become UTCP tool URLs with path parameters
- **Method Mapping**: HTTP methods are preserved
- **Parameter Mapping**: Path, query, header, and body parameters are mapped appropriately
- **Authentication**: OpenAPI security schemes are converted to UTCP auth configurations
- **Schema Validation**: OpenAPI schemas become UTCP input/output schemas

### Example Conversion
```yaml
# OpenAPI Specification
paths:
  /users/{id}:
    get:
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
```

Becomes a UTCP tool:
```json
{
  "name": "get_user",
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/users/{id}",
    "http_method": "GET"
  },
  "inputs": {
    "type": "object",
    "properties": {
      "id": {"type": "string"}
    },
    "required": ["id"]
  }
}
```

## Response Handling

HTTP responses are processed based on:
- **Status Codes**: 2xx considered success, 4xx/5xx raise exceptions
- **Content-Type**: 
  - `application/json`: Parsed as JSON object
  - Other types: Returned as text string
- **Error Handling**: HTTP client errors are logged and re-raised
- **Timeouts**: 10 seconds for tool discovery, 30 seconds for tool execution

## Security Features

### HTTPS Enforcement
The HTTP protocol enforces secure connections by only allowing:
- HTTPS URLs (`https://`)
- Localhost URLs (`http://localhost` or `http://127.0.0.1`)

Any other HTTP URLs will be rejected with a security error to prevent man-in-the-middle attacks.

### OAuth2 Token Caching
OAuth2 tokens are automatically cached by `client_id` to avoid repeated authentication requests. The protocol supports both:
- **Body credentials**: Client ID/secret in request body
- **Header credentials**: Client ID/secret as Basic Auth header

### Request Security
- URL path parameters are properly URL-encoded to prevent path injection
- All authentication credentials support environment variable substitution
- Cookies are supported for API key authentication when required

## Security Considerations

### SSL/TLS Verification
- Always verify SSL certificates in production
- Use `verify_ssl: false` only for testing/development
- Consider certificate pinning for high-security applications

### Authentication Security
- Store credentials in environment variables, not in configuration files
- Use OAuth2 for user-facing applications
- Rotate API keys regularly
- Implement proper token refresh for OAuth2

### Input Validation
- Validate all input parameters before substitution
- Sanitize user inputs to prevent injection attacks
- Use allowlists for acceptable parameter values
- Implement rate limiting on the tool provider side

### Network Security
- HTTPS is enforced by the protocol (except for localhost development)
- All credentials should use environment variable substitution (e.g., `${API_KEY}`)
- Path parameters are automatically URL-encoded to prevent injection attacks
- OAuth2 tokens are cached securely and not logged

## Error Handling

Common HTTP errors and their meanings:

| Status Code | Error Type | Description |
|-------------|------------|-------------|
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Authentication required or failed |
| 403 | Forbidden | Access denied |
| 404 | Not Found | Resource doesn't exist |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Internal server error |
| 503 | Service Unavailable | Service temporarily unavailable |

## Best Practices

### Performance
- Each request uses a fresh aiohttp ClientSession
- Tool discovery timeout: 10 seconds
- Tool execution timeout: 30 seconds
- OAuth2 tokens are cached to reduce authentication overhead

### Reliability
- Implement retry logic with exponential backoff
- Handle network failures gracefully
- Use circuit breakers for unreliable services
- Monitor response times and error rates

### Maintainability
- Use descriptive tool names and descriptions
- Document all required parameters
- Provide usage examples
- Version your APIs and update call templates accordingly

## Complete Examples

### Basic GET Request
```json
{
  "name": "get_user",
  "call_template_type": "http",
  "url": "https://api.example.com/users/{user_id}",
  "http_method": "GET"
}
```

### POST with Authentication and Body
```json
{
  "name": "create_user",
  "call_template_type": "http",
  "url": "https://api.example.com/users",
  "http_method": "POST",
  "content_type": "application/json",
  "body_field": "user_data",
  "header_fields": ["request_id"],
  "auth": {
    "auth_type": "api_key",
    "api_key": "Bearer ${API_KEY}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

### OAuth2 Authentication
```json
{
  "name": "oauth_api",
  "call_template_type": "http",
  "url": "https://api.example.com/data",
  "http_method": "GET",
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "read write"
  }
}
```

## Language-Specific Implementation

For implementation details and examples in your programming language:

- **Python**: See `python-utcp/plugins/communication_protocols/http/`
- **TypeScript**: [TypeScript HTTP Protocol Documentation](https://github.com/universal-tool-calling-protocol/typescript-utcp/blob/main/docs/protocols/http.md)
- **Other languages**: Check respective repositories in the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)
