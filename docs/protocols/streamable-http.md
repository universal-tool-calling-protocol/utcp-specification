---
id: streamable-http
title: Streamable HTTP Protocol
sidebar_position: 2
---

# Streamable HTTP Protocol

The Streamable HTTP protocol plugin (`utcp-http`) enables UTCP to handle large HTTP responses by streaming them in chunks. This is ideal for tools that return large datasets, files, or progressive results that don't fit into a single response payload. It leverages HTTP Chunked Transfer Encoding.

## Call Template Structure

```json
{
  "call_template_type": "streamable_http",
  "url": "https://api.example.com/download/large-file",
  "http_method": "GET",
  "headers": {
    "Accept": "application/octet-stream"
  },
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "Authorization",
    "location": "header"
  },
  "chunk_size": 8192,
  "timeout": 300000,
  "body_field": "request_data",
  "header_fields": ["custom_header_arg"]
}
```

## Configuration Options

The Streamable HTTP call template provides a way to configure streaming from HTTP endpoints.

| Option | Type | Default | Description |
|---|---|---|---|
| `url` | string | **Required** | The streaming HTTP endpoint URL. Supports path parameters like `/users/{user_id}`. |
| `http_method` | string | `GET` | The HTTP method to use. Supported methods are `GET` and `POST`. |
| `content_type` | string | `application/octet-stream` | The `Content-Type` header to set for the request, especially when `body_field` is used. |
| `chunk_size` | integer | `4096` | The size of each data chunk in bytes to read from the stream. |
| `timeout` | integer | `60000` | Request timeout in milliseconds. |
| `headers` | object | `null` | Optional static headers to include in every request. |
| `auth` | object | `null` | Optional authentication configuration. See [HTTP Authentication](./http.md#authentication-methods). |
| `body_field` | string | `null` | The name of a single tool argument to be sent as the HTTP request body. |
| `header_fields` | array | `null` | A list of tool argument names to be sent as request headers. |

## Response Handling

The protocol processes the incoming stream based on the `Content-Type` header of the response:

- **`application/x-ndjson`**: The stream is parsed as Newline Delimited JSON. Each line is yielded as a separate JSON object.
- **`application/octet-stream`**: The stream is yielded in binary chunks of the specified `chunk_size`.
- **`application/json`**: The entire response is buffered and yielded as a single JSON object. This is for endpoints that stream a single, large JSON document.
- **Other Types**: For any other `Content-Type`, the response is treated as a binary stream and yielded in chunks of `chunk_size`.

## Authentication

Streamable HTTP supports the same authentication methods as the standard HTTP protocol, including API Key, Basic Auth, and OAuth2. The configuration is identical.

For more details, see the [HTTP Authentication Methods](./http.md#authentication-methods) documentation.

## Variable Substitution

Path parameters, query parameters, headers, and authentication fields all support variable substitution from tool arguments and environment variables, following the same syntax as the standard HTTP protocol.

Example:
```json
{
  "url": "https://api.example.com/files/{file_id}/download",
  "headers": {
    "Authorization": "Bearer ${ACCESS_TOKEN}"
  }
}
```
Here, `{file_id}` is substituted from a tool argument, and `${ACCESS_TOKEN}` is substituted from an environment or configuration variable.

For more details, see the [HTTP Variable Substitution](./http.md#variable-substitution) documentation.

## Security Considerations

- **SSL/TLS**: It is strongly recommended to use `https://` endpoints to protect data in transit. The implementation enforces HTTPS or localhost connections by default.
- **Authentication**: Never hardcode credentials. Use variable substitution to inject secrets from a secure source (e.g., environment variables).
- **Input Sanitization**: Ensure that any arguments used in URL path parameters or query strings are properly validated and sanitized to prevent injection attacks.

## Error Handling

Errors are handled similarly to the standard HTTP protocol:

| Status Code | Error Type | Description |
|---|---|---|
| 400 | Bad Request | Invalid request parameters or body. |
| 401 | Unauthorized | Authentication failed or is required. |
| 403 | Forbidden | The authenticated user does not have permission. |
| 404 | Not Found | The requested resource or endpoint does not exist. |
| 5xx | Server Error | An error occurred on the server side. |

Connection errors, timeouts, and other network issues will also be raised as exceptions.

## Related Protocols

- [HTTP](./http.md) - For standard request/response interactions.
- [Server-Sent Events (SSE)](./sse.md) - For unidirectional, real-time event streams from server to client.