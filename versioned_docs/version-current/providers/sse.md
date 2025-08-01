---
sidebar_position: 1
---




---
sidebar_position: 1
---

# Server-Sent Events (SSE) Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The SSE provider enables one-way streaming communication from servers to clients, making it ideal for real-time updates, notifications, and data feeds that don't require bidirectional communication.

## Configuration

SSE providers are configured using the following JSON structure:

```json
{
  "name": "live_updates_service",
  "provider_type": "sse",
  "url": "https://api.example.com/events",
  "event_type": "message",
  "reconnect": true,
  "retry_timeout": 30000,
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "X-API-Key"
  },
  "headers": {
    "User-Agent": "UTCP Client"
  },
  "body_field": "payload",
  "header_fields": ["api_version", "client_id"]
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|--------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"sse"` |
| `url` | Yes | Full URL to the SSE endpoint |
| `event_type` | No | The event type to listen for (default: `null`, which listens for all events) |
| `reconnect` | No | Whether to automatically reconnect if the connection is lost (default: `true`) |
| `retry_timeout` | No | Retry timeout in milliseconds if disconnected (default: `30000`) |
| `auth` | No | Authentication configuration (if required) |
| `headers` | No | Additional HTTP headers to include in the request |
| `body_field` | No | The name of the single input field to be sent as the request body |
| `header_fields` | No | List of input fields to be sent as request headers for the initial connection |

## Tool Discovery

For SSE providers, the tool discovery endpoint should be accessible at `/utcp` on the same domain as the API. For example:

```
https://api.example.com/utcp
```

Since SSE is primarily for receiving streaming data, tools that use SSE providers typically have simple inputs (to establish the connection) and structured streaming outputs.

## Message Format

SSE follows a text-based protocol where each message consists of one or more lines of text:

```
event: event_type
id: message_id
data: {"key": "value"}

```

In UTCP, the `data` field is expected to contain JSON that matches the tool's output schema.

## Authentication

SSE providers support the same authentication methods as HTTP providers:

- API Key (in headers)
- Basic Authentication
- OAuth2

Since SSE connections are essentially long-lived HTTP connections, authentication is typically handled during the initial connection request.

## Making Tool Calls

When a tool associated with an SSE provider is called, the UTCP client will:

1. Establish an SSE connection to the specified URL with any input parameters as query parameters
2. Listen for events of the specified type
3. Parse each event's data according to the tool's output schema
4. Continue receiving events until the connection is closed or the tool call is terminated

## Reconnection Strategy

SSE includes built-in reconnection support through the `Last-Event-ID` header. UTCP clients should:

1. Store the last received event ID
2. If the connection drops, reconnect with the `Last-Event-ID` header set
3. Implement exponential backoff for reconnection attempts

## Examples

### Real-time Market Updates

```json
{
  "name": "market_updates",
  "provider_type": "sse",
  "url": "https://markets.example.com/stream",
  "event_type": "price_update"
}
```

Tool definition:
```json
{
  "name": "watch_stock",
  "description": "Get real-time price updates for a stock",
  "inputs": {
    "type": "object",
    "properties": {
      "symbol": {
        "type": "string",
        "description": "Stock symbol (e.g., AAPL)"
      }
    },
    "required": ["symbol"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "symbol": {
        "type": "string",
        "description": "Stock symbol"
      },
      "price": {
        "type": "number",
        "description": "Current price"
      },
      "change": {
        "type": "number",
        "description": "Price change"
      },
      "timestamp": {
        "type": "string",
        "description": "Update time"
      }
    }
  }
}
```

Connection URL with parameters:
```
https://markets.example.com/stream?symbol=AAPL
```

### Notification System

```json
{
  "name": "notification_service",
  "provider_type": "sse",
  "url": "https://notify.example.com/events",
  "event_type": "notification",
  "auth": {
    "auth_type": "api_key",
    "api_key": "YOUR_API_KEY",
    "var_name": "X-API-Key"
  }
}
```

## Handling Multiple Tools

A single SSE connection can support multiple tools by:

1. Using different event types for different tools
2. Including a tool identifier in the event data
3. Using filtering parameters in the connection URL

## Best Practices

1. **Connection Management**: Limit the number of concurrent SSE connections
2. **Reconnection Logic**: Implement robust reconnection with backoff
3. **Data Processing**: Handle events asynchronously to avoid blocking
4. **Error Handling**: Monitor for connection issues and malformed data
5. **Resource Cleanup**: Close SSE connections when they're no longer needed

## Common Issues

| Issue | Solution |
|-------|----------|
| Connection timeouts | Implement heartbeat messages or separate ping endpoint |
| Proxy/firewall issues | Ensure infrastructure supports long-lived HTTP connections |
| Event ordering | Use event IDs to track and potentially reorder messages |
| Duplicate events | Track processed event IDs to avoid duplicates after reconnection |

SSE providers are ideal for scenarios where clients need to receive real-time updates without the complexity of bidirectional protocols like WebSockets.
