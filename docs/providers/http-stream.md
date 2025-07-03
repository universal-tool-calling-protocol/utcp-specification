---
title: HTTP Stream Provider
layout: default
parent: Provider Types
nav_order: 3
---

# HTTP Stream Provider (WIP)

{: .warning }
> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The HTTP Stream provider enables streaming data transfers over HTTP using chunked transfer encoding, making it suitable for scenarios where continuous data needs to be sent over standard HTTP infrastructure.

## Configuration

HTTP Stream providers are configured using the following JSON structure:

```json
{
  "name": "streaming_service",
  "provider_type": "http_stream",
  "url": "https://api.example.com/stream",
  "http_method": "POST",
  "content_type": "application/octet-stream",
  "chunk_size": 4096,
  "timeout": 60000,
  "headers": {
    "User-Agent": "UTCP Client"
  },
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "X-API-Key"
  },
  "body_field": "prompt",
  "header_fields": ["stream_format", "model"]
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"http_stream"` |
| `url` | Yes | Full URL to the streaming endpoint |
| `http_method` | No | HTTP method to use (default: `"GET"`) |
| `content_type` | No | Content type header (default: `"application/octet-stream"`) |
| `chunk_size` | No | Size of chunks in bytes (default: `4096`) |
| `timeout` | No | Timeout in milliseconds (default: `60000`) |
| `headers` | No | Additional HTTP headers to include in the request |
| `auth` | No | Authentication configuration (if required) |
| `body_field` | No | The name of the single input field to be sent as the request body |
| `header_fields` | No | List of input fields to be sent as request headers |

## Tool Discovery

For HTTP Stream providers, the tool discovery endpoint should be accessible at `/utcp` on the same domain as the API. For example:

```
https://api.example.com/utcp
```

## Authentication

HTTP Stream providers support the same authentication methods as standard HTTP providers:

- API Key (in headers)
- Basic Authentication
- OAuth2

## Making Tool Calls

When a tool associated with an HTTP Stream provider is called, the UTCP client will:

1. Establish an HTTP connection to the specified URL with the appropriate method
2. Set the appropriate headers and include input parameters as query parameters or in the request body
3. Process the chunked response data according to the tool's output schema
4. Continue receiving chunks until the connection is closed or the timeout is reached

## Examples

### Text Generation Stream

```json
{
  "name": "text_generator",
  "provider_type": "http_stream",
  "url": "https://ai.example.com/generate/stream",
  "http_method": "POST",
  "content_type": "application/json",
  "body_field": "prompt"
}
```

Tool definition:
```json
{
  "name": "generate_text",
  "description": "Generate text from a prompt with streaming response",
  "inputs": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string",
        "description": "The prompt to generate text from"
      },
      "max_tokens": {
        "type": "integer",
        "description": "Maximum tokens to generate",
        "default": 100
      }
    },
    "required": ["prompt"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "Generated text chunk"
      },
      "finished": {
        "type": "boolean",
        "description": "Whether this is the final chunk"
      }
    }
  }
}
```

## Best Practices

1. **Error Handling**: Implement robust error handling for connection issues and malformed chunks
2. **Backpressure**: Consider implementing backpressure mechanisms for high-volume streams
3. **Reconnection**: Implement reconnection logic with backoff for unreliable networks
4. **Timeouts**: Set appropriate timeouts based on expected response times
5. **Partial Processing**: Design tools to handle partial data effectively

HTTP Stream providers bridge the gap between standard HTTP APIs and streaming use cases, making them ideal for situations where WebSockets or SSE might be blocked by firewalls or proxies.
