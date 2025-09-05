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
pip install utcp-http
```

## Call Template Structure

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events",
  "headers": {
    "Authorization": "Bearer ${API_TOKEN}",
    "Accept": "text/event-stream"
  },
  "timeout": 60,
  "max_events": 10,
  "event_filter": {
    "type": "data_update"
  }
}
```

## Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `call_template_type` | string | Must be `"sse"` |
| `url` | string | SSE endpoint URL |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `headers` | object | HTTP headers for the request |
| `query_params` | object | URL query parameters |
| `timeout` | number | Stream timeout in seconds (default: 60) |
| `max_events` | number | Maximum events to receive (default: unlimited) |
| `event_filter` | object | Filter events by type or data |
| `reconnect` | boolean | Auto-reconnect on connection loss (default: true) |
| `reconnect_delay` | number | Delay between reconnection attempts (default: 3) |

## Authentication

SSE uses standard HTTP authentication methods:

### Bearer Token

```json
{
  "headers": {
    "Authorization": "Bearer ${ACCESS_TOKEN}"
  }
}
```

### API Key

```json
{
  "headers": {
    "X-API-Key": "${API_KEY}"
  }
}
```

### Query Parameter Auth

```json
{
  "query_params": {
    "token": "${API_TOKEN}",
    "user_id": "${USER_ID}"
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
    "url": "https://api.example.com/notifications/stream",
    "query_params": {
      "user_id": "${user_id}"
    },
    "headers": {
      "Authorization": "Bearer ${ACCESS_TOKEN}"
    },
    "timeout": 300
  }
}
```

### Filtered Events

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events",
  "event_filter": {
    "type": "order_update",
    "status": ["completed", "cancelled"]
  },
  "max_events": 5
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
      "symbols": {
        "type": "array",
        "items": {"type": "string"}
      },
      "duration": {"type": "number", "default": 60}
    },
    "required": ["symbols"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://api.stocks.com/stream",
    "query_params": {
      "symbols": "${symbols}",
      "format": "json"
    },
    "headers": {
      "Authorization": "Bearer ${STOCK_API_KEY}"
    },
    "timeout": "${duration}",
    "event_filter": {
      "type": "price_update"
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
      "level": {"type": "string", "enum": ["error", "warn", "info", "debug"]}
    },
    "required": ["service"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://logs.example.com/stream",
    "query_params": {
      "service": "${service}",
      "level": "${level}"
    },
    "headers": {
      "X-API-Key": "${LOG_API_KEY}"
    },
    "timeout": 600,
    "max_events": 100
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
      "metrics": {
        "type": "array",
        "items": {"type": "string"}
      },
      "interval": {"type": "number", "default": 5}
    },
    "required": ["metrics"]
  },
  "tool_call_template": {
    "call_template_type": "sse",
    "url": "https://monitoring.example.com/metrics/stream",
    "query_params": {
      "metrics": "${metrics}",
      "interval": "${interval}"
    },
    "headers": {
      "Authorization": "Bearer ${MONITORING_TOKEN}"
    },
    "timeout": 300,
    "reconnect": true,
    "reconnect_delay": 5
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

### Custom Event Parsing

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events",
  "event_parser": {
    "format": "json",
    "extract_fields": ["timestamp", "level", "message"]
  }
}
```

### Event Aggregation

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/metrics",
  "aggregation": {
    "window": 10,
    "function": "average",
    "field": "value"
  }
}
```

### Conditional Termination

```json
{
  "call_template_type": "sse",
  "url": "https://api.example.com/events",
  "termination_condition": {
    "event_type": "complete",
    "data_field": "status",
    "value": "finished"
  }
}
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

- [HTTP](./http.md) - For request/response patterns
- [WebSocket](./websocket.md) - For bidirectional communication
- [Streamable HTTP](./streamable-http.md) - For chunked HTTP responses
