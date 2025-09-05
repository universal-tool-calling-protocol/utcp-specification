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
  "url": "https://api.example.com/endpoint",
  "http_method": "GET|POST|PUT|DELETE|PATCH",
  "headers": {
    "Content-Type": "application/json",
    "User-Agent": "UTCP-Client/1.0"
  },
  "query_params": {
    "param1": "${variable1}",
    "param2": "static_value"
  },
  "body": {
    "data": "${input_data}",
    "timestamp": "${current_time}"
  },
  "timeout": 30,
  "verify_ssl": true,
  "auth": {
    "auth_type": "api_key|basic|oauth2",
    "api_key": "${API_KEY}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

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
    "location": "header"
  }
}
```

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

## Variable Substitution

Variables in call templates are substituted with values from:
- Tool call arguments: `${argument_name}`
- Environment variables: `${ENV_VAR}`
- Configuration variables: `${config.variable}`

Example:
```json
{
  "url": "https://api.example.com/users/${user_id}",
  "headers": {
    "Authorization": "Bearer ${ACCESS_TOKEN}"
  },
  "query_params": {
    "format": "${output_format}",
    "limit": "${max_results}"
  }
}
```

## OpenAPI Integration

The HTTP protocol plugin can automatically generate UTCP manuals from OpenAPI/Swagger specifications:

1. **Automatic Discovery**: Point to an OpenAPI spec URL
2. **Schema Conversion**: Converts OpenAPI paths to UTCP tools
3. **Authentication Mapping**: Maps OpenAPI security schemes to UTCP auth
4. **Parameter Mapping**: Converts OpenAPI parameters to UTCP inputs

Example OpenAPI to UTCP conversion:
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

Becomes:
```json
{
  "name": "get_user",
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/users/${id}",
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
- **Status Codes**: 2xx considered success, others as errors
- **Content-Type**: JSON, XML, text, and binary content support
- **Headers**: Response headers available in tool output
- **Error Mapping**: HTTP errors mapped to UTCP exceptions

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | number | 30 | Request timeout in seconds |
| `verify_ssl` | boolean | true | Verify SSL certificates |
| `follow_redirects` | boolean | true | Follow HTTP redirects |
| `max_redirects` | number | 5 | Maximum redirect hops |
| `retry_count` | number | 0 | Number of retry attempts |
| `retry_delay` | number | 1 | Delay between retries (seconds) |

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
- Use HTTPS for all production communications
- Implement proper firewall rules
- Consider using VPNs or private networks for sensitive tools
- Monitor and log all HTTP requests for security analysis

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
- Use connection pooling for multiple requests
- Implement appropriate timeouts
- Consider request/response compression
- Cache responses when appropriate

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

## Language-Specific Implementation

For implementation details and examples in your programming language:

- **Multi-language**: [UTCP HTTP Protocol Examples](https://github.com/universal-tool-calling-protocol) - HTTP protocol examples across multiple languages
- **TypeScript**: [TypeScript HTTP Protocol Documentation](https://github.com/universal-tool-calling-protocol/typescript-utcp/blob/main/docs/protocols/http.md)
- **Other languages**: Check respective repositories in the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)
