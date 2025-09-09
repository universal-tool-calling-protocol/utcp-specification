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
  "url": "https://api.example.com/download/{file_id}",
  "http_method": "GET",
  "content_type": "application/octet-stream",
  "chunk_size": 4096,
  "timeout": 60000,
  "headers": {
    "Accept": "application/octet-stream"
  },
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "Authorization",
    "location": "header"
  },
  "body_field": "request_data",
  "header_fields": ["custom_header_arg"]
}
```

## Field Descriptions

For detailed field specifications, examples, and validation rules, see:
- **[StreamableHttpCallTemplate API Reference](../api/plugins/communication_protocols/http/src/utcp_http/streamable_http_call_template.md)** - Complete field documentation with examples
- **[StreamableHttpCommunicationProtocol API Reference](../api/plugins/communication_protocols/http/src/utcp_http/streamable_http_communication_protocol.md)** - Implementation details and method documentation

### Key Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `call_template_type` | string | Yes | - | Always "streamable_http" for streaming HTTP providers |
| `url` | string | Yes | - | HTTP endpoint URL with optional path parameters like `{file_id}` |
| `http_method` | string | No | "GET" | HTTP method to use ("GET" or "POST") |
| `content_type` | string | No | "application/octet-stream" | Content-Type header for requests |
| `chunk_size` | number | No | 4096 | Size of each data chunk in bytes |
| `timeout` | number | No | 60000 | Request timeout in milliseconds |
| `headers` | object | No | null | Static headers to include in requests |
| `auth` | object | No | null | Authentication configuration |
| `body_field` | string | No | null | Tool argument name to map to request body |
| `header_fields` | array | No | null | Tool argument names to map to request headers |

## Response Handling

The protocol processes the incoming stream based on the `Content-Type` header of the response:

- **`application/x-ndjson`**: The stream is parsed as Newline Delimited JSON. Each line is yielded as a separate JSON object.
- **`application/octet-stream`**: The stream is yielded in binary chunks of the specified `chunk_size`.
- **`application/json`**: The entire response is buffered and yielded as a single JSON object. This is for endpoints that stream a single, large JSON document.
- **Other Types**: For any other `Content-Type`, the response is treated as a binary stream and yielded in chunks of `chunk_size`.

## Authentication

Streamable HTTP supports the same authentication methods as HTTP:

### API Key Authentication
```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "Bearer ${ACCESS_TOKEN}",
    "var_name": "Authorization",
    "location": "header"
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

Streamable HTTP processes tool arguments through a hierarchy:

1. **URL path parameters**: Substituted using `{parameter_name}` syntax
2. **Body field**: Single argument mapped to request body via `body_field`
3. **Header fields**: Arguments mapped to headers via `header_fields`
4. **Query parameters**: Remaining arguments sent as query parameters

### URL Path Parameters
Parameters in URLs are substituted from tool arguments:
```json
{
  "url": "https://api.example.com/files/{file_id}/download/{format}"
}
```
Tool arguments `file_id` and `format` are substituted into the URL path.

### Variable Substitution
Authentication and header values support environment variable substitution:
```json
{
  "headers": {
    "Authorization": "Bearer ${ACCESS_TOKEN}"
  }
}
```

## Security Considerations

### Connection Security
- **HTTPS enforcement**: Only HTTPS URLs or localhost connections are allowed
- **Certificate validation**: SSL certificates are validated by default
- **Secure token handling**: OAuth2 tokens are cached securely

### Authentication Security
- **Environment variables**: Use `${VAR_NAME}` syntax for sensitive credentials
- **Token caching**: OAuth2 tokens are cached by client_id to avoid repeated requests
- **Authentication methods**: Support for API key, Basic auth, and OAuth2
- **Location flexibility**: API keys can be sent in headers, query params, or cookies
- **URL encoding**: Path parameters are properly URL-encoded to prevent injection

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

## Usage Examples

### Large File Download
```json
{
  "name": "download_dataset",
  "description": "Download large dataset files",
  "inputs": {
    "type": "object",
    "properties": {
      "dataset_id": {"type": "string"},
      "format": {"type": "string", "enum": ["csv", "json", "parquet"]}
    },
    "required": ["dataset_id"]
  },
  "tool_call_template": {
    "call_template_type": "streamable_http",
    "url": "https://data.example.com/datasets/{dataset_id}/download",
    "http_method": "GET",
    "chunk_size": 8192,
    "timeout": 300000,
    "header_fields": ["format"],
    "auth": {
      "auth_type": "api_key",
      "api_key": "${DATA_API_KEY}",
      "var_name": "X-API-Key",
      "location": "header"
    }
  }
}
```

### Streaming JSON Data
```json
{
  "name": "export_records",
  "description": "Export large record sets as streaming NDJSON",
  "inputs": {
    "type": "object",
    "properties": {
      "table_name": {"type": "string"},
      "filters": {"type": "object"}
    },
    "required": ["table_name"]
  },
  "tool_call_template": {
    "call_template_type": "streamable_http",
    "url": "https://api.example.com/export/{table_name}",
    "http_method": "POST",
    "content_type": "application/json",
    "chunk_size": 4096,
    "body_field": "filters",
    "auth": {
      "auth_type": "oauth2",
      "client_id": "${OAUTH_CLIENT_ID}",
      "client_secret": "${OAUTH_CLIENT_SECRET}",
      "token_url": "https://auth.example.com/token",
      "scope": "data:export"
    }
  }
}
```

## Implementation Notes

The Streamable HTTP protocol implementation provides:

- **Chunked streaming**: Processes responses in configurable chunk sizes
- **Content-type awareness**: Different handling for JSON, NDJSON, and binary content
- **Authentication caching**: OAuth2 tokens cached by client_id
- **Security enforcement**: HTTPS or localhost connections only
- **Error handling**: Graceful handling of connection failures and timeouts
- **Resource management**: Proper cleanup of HTTP connections and sessions

### Usage Example
```python
import asyncio
from utcp_client import UtcpClient

async def main():
    client = UtcpClient()
    
    # Register streamable HTTP provider
    await client.register_tool_provider(streamable_http_manual)
    
    # Stream large dataset
    async for chunk in client.call_tool_streaming("download_dataset", {"dataset_id": "large_dataset_123"}):
        process_chunk(chunk)  # Process each chunk as it arrives
    
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

## Related Protocols

- **[HTTP](./http.md)** - For standard request/response interactions
- **[Server-Sent Events (SSE)](./sse.md)** - For real-time event streams from server to client
- **TCP/UDP** - For custom protocol implementations

For complete implementation details, see the [Streamable HTTP Communication Protocol API Reference](../api/plugins/communication_protocols/http/src/utcp_http/streamable_http_communication_protocol.md).