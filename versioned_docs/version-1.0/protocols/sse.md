---
id: sse
title: Server-Sent Events (SSE)
sidebar_position: 3
---

# Server-Sent Events (SSE)

The Server-Sent Events protocol plugin (`utcp-http`) enables UTCP to receive real-time streaming data from HTTP servers. SSE is perfect for tools that need to stream live updates, notifications, or continuous data feeds.

## Installation

SSE support is included with the HTTP plugin:

```bash
# Example installation (Python)
pip install utcp-http

# Example installation (Node.js)
npm install @utcp/http
```

## Call Template Structure

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events/{stream_id}",
  "event_type": "data_update",
  "reconnect": true,
  "retry_timeout": 30000,
  "headers": {
    "X-Custom-Header": "static_value"
  },
  "body_field": "payload",
  "header_fields": ["user_id", "session_token"],
  "auth": {
    "auth_type": "api_key",
    "api_key": "Bearer ${API_TOKEN}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

## Field Descriptions

For detailed field specifications, examples, and validation rules, see:
- **[SseCallTemplate API Reference](../api/plugins/communication_protocols/http/src/utcp_http/sse_call_template.md)** - Complete field documentation with examples
- **[SseCommunicationProtocol API Reference](../api/plugins/communication_protocols/http/src/utcp_http/sse_communication_protocol.md)** - Implementation details and method documentation

### Key Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `call_template_type` | string | Yes | Always "sse" for SSE providers |
| `url` | string | Yes | SSE endpoint URL with optional path parameters like `{stream_id}` |
| `event_type` | string | No | Filter for specific event types (default: all events) |
| `reconnect` | boolean | No | Auto-reconnect on connection loss (default: true) |
| `retry_timeout` | number | No | Retry timeout in milliseconds (default: 30000) |
| `headers` | object | No | Static headers for the initial connection |
| `body_field` | string | No | Tool argument name to map to request body |
| `header_fields` | array | No | Tool argument names to map to request headers |
| `auth` | object | No | Authentication configuration |

## Authentication

SSE supports the same authentication methods as HTTP:

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

## Event Handling

### Basic Event Stream

```json
{
  "name": "stream_notifications",
  "description": "Stream real-time notifications",
  "inputs": {
    "type": "object",
    "properties": {
      "user_id": {"type": "string"}
    },
    "required": ["user_id"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://api.example.com/notifications/stream/{user_id}",
    "event_type": "notification",
    "reconnect": true,
    "retry_timeout": 30000,
    "auth": {
      "auth_type": "api_key",
      "api_key": "Bearer ${ACCESS_TOKEN}",
      "var_name": "Authorization",
      "location": "header"
    }
  }
}
```

### Filtered Events

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events",
  "event_type": "order_update",
  "reconnect": true,
  "retry_timeout": 15000
}
```

## Examples

### Stock Price Stream

```json
{
  "name": "stream_stock_prices",
  "description": "Stream real-time stock price updates",
  "inputs": {
    "type": "object",
    "properties": {
      "symbol": {"type": "string"}
    },
    "required": ["symbol"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://api.stocks.com/stream/{symbol}",
    "event_type": "price_update",
    "reconnect": true,
    "retry_timeout": 30000,
    "auth": {
      "auth_type": "api_key",
      "api_key": "${STOCK_API_KEY}",
      "var_name": "Authorization",
      "location": "header"
    }
  }
}
```

### Log Monitoring

```json
{
  "name": "monitor_logs",
  "description": "Monitor application logs in real-time",
  "inputs": {
    "type": "object",
    "properties": {
      "service": {"type": "string"},
      "level": {"type": "string"}
    },
    "required": ["service"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://logs.example.com/stream/{service}",
    "event_type": "log_entry",
    "reconnect": true,
    "retry_timeout": 45000,
    "body_field": "filter_config",
    "header_fields": ["level"],
    "auth": {
      "auth_type": "api_key",
      "api_key": "${LOG_API_KEY}",
      "var_name": "X-API-Key",
      "location": "header"
    }
  }
}
```

### System Metrics Stream

```json
{
  "name": "stream_metrics",
  "description": "Stream system performance metrics",
  "inputs": {
    "type": "object",
    "properties": {
      "server_id": {"type": "string"},
      "metrics_config": {"type": "object"}
    },
    "required": ["server_id"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://monitoring.example.com/metrics/stream/{server_id}",
    "event_type": "metric_update",
    "reconnect": true,
    "retry_timeout": 20000,
    "body_field": "metrics_config",
    "auth": {
      "auth_type": "oauth2",
      "client_id": "${MONITORING_CLIENT_ID}",
      "client_secret": "${MONITORING_CLIENT_SECRET}",
      "token_url": "https://auth.monitoring.com/token",
      "scope": "metrics:read"
    }
  }
}
```

## Event Format

SSE events follow the standard format:

```
event: message
data: {"type": "update", "value": 123}
id: event-123
retry: 3000

event: heartbeat
data: {"timestamp": "2024-01-15T10:30:00Z"}

data: {"message": "Simple data without event type"}
```

### Parsed Event Structure

```json
{
  "event": "message",
  "data": {"type": "update", "value": 123},
  "id": "event-123",
  "retry": 3000,
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## Response Handling

### Single Event Response

```json
{
  "events": [
    {
      "event": "data",
      "data": {"result": "success"},
      "id": "1",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "total_events": 1,
  "duration": 2.5
}
```

### Multiple Events Response

```json
{
  "events": [
    {
      "event": "start",
      "data": {"status": "processing"},
      "id": "1"
    },
    {
      "event": "progress",
      "data": {"percent": 50},
      "id": "2"
    },
    {
      "event": "complete",
      "data": {"result": "success"},
      "id": "3"
    }
  ],
  "total_events": 3,
  "duration": 15.2
}
```

## Error Handling

| Error Type | Description | Handling |
|------------|-------------|----------|
| Connection Failed | Cannot connect to SSE endpoint | Raise `SSEConnectionError` |
| Stream Timeout | No events received within timeout | Return partial results |
| Parse Error | Invalid SSE event format | Skip malformed events |
| Authentication Failed | Invalid credentials | Raise `SSEAuthError` |
| Server Error | HTTP 5xx response | Raise `SSEServerError` |

## Best Practices

1. **Set Appropriate Timeouts**: Configure timeouts based on expected data frequency
2. **Handle Reconnections**: Enable auto-reconnect for long-running streams
3. **Filter Events**: Use event filters to reduce unnecessary data processing
4. **Monitor Performance**: Track event rates and processing times
5. **Validate Data**: Validate incoming event data against expected schemas
6. **Handle Backpressure**: Implement buffering for high-frequency events
7. **Graceful Shutdown**: Properly close streams when done

## Advanced Features

### Dynamic Parameter Substitution
- **URL path parameters**: Use `{parameter_name}` syntax in URLs
- **Body field mapping**: Map tool arguments to request body via `body_field`
- **Header field mapping**: Map tool arguments to headers via `header_fields`

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events/{stream_id}",
  "event_type": "data_update",
  "body_field": "filter_config",
  "header_fields": ["user_context", "session_id"]
}
```

### OAuth2 Token Management
- **Automatic token caching**: Tokens cached by client_id
- **Token refresh**: Automatic token refresh on expiration
- **Client credentials flow**: Supports OAuth2 client credentials grant

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${OAUTH_CLIENT_ID}",
    "client_secret": "${OAUTH_CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "stream:read"
  }
}
```

### Multiple Authentication Locations
- **Header**: Standard Authorization header or custom headers
- **Query**: API key as URL query parameter
- **Cookie**: API key sent as HTTP cookie

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_TOKEN}",
    "var_name": "access_token",
    "location": "cookie"
  }
}
```

## Implementation Notes

The SSE protocol implementation provides:

- **Async streaming**: Real-time event processing with async generators
- **Automatic reconnection**: Configurable via `reconnect` and `retry_timeout` fields
- **Event filtering**: Client-side filtering by `event_type`
- **Authentication caching**: OAuth2 tokens cached by client_id
- **Security enforcement**: HTTPS or localhost connections only
- **Error handling**: Graceful handling of connection failures and retries

### Usage Example
```python
import asyncio
from utcp_client import UtcpClient

async def main():
    client = UtcpClient()
    
    # Register SSE provider
    await client.register_tool_provider(sse_manual)
    
    # Stream events with automatic filtering and reconnection
    async for event in client.call_tool_streaming("stream_notifications", {"user_id": "123"}):
        print(f"Event: {event}")
    
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

## Common Use Cases

- **Real-time Dashboards**: Live metrics, status updates
- **Notifications**: User alerts, system notifications
- **Log Streaming**: Application logs, audit trails
- **Progress Tracking**: Long-running task progress
- **Live Data Feeds**: News, social media, sensor data
- **Chat Applications**: Message streams, typing indicators

## Protocol Comparison

| Feature | SSE | WebSocket | HTTP Polling |
|---------|-----|-----------|--------------|
| Server-to-Client | ✅ | ✅ | ✅ |
| Client-to-Server | ❌ | ✅ | ✅ |
| Auto-Reconnect | ✅ | Manual | Manual |
| Overhead | Low | Low | High |
| Browser Support | ✅ | ✅ | ✅ |
| Simplicity | High | Medium | High |

## Related Protocols

- **[HTTP](./http.md)** - For standard request/response patterns
- **WebSocket** - For bidirectional real-time communication  
- **TCP/UDP** - For custom protocol implementations

For complete implementation details, see the [SSE Communication Protocol API Reference](../api/plugins/communication_protocols/http/src/utcp_http/sse_communication_protocol.md).
