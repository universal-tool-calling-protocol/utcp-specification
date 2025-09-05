---
id: websocket
title: WebSocket Protocol
sidebar_position: 2
---

# WebSocket Protocol

The WebSocket protocol plugin (`utcp-websocket`) enables UTCP to communicate with WebSocket servers for real-time, bidirectional communication. This is ideal for tools that require persistent connections or real-time updates.

## Installation

```bash
# Example installation (Python)
pip install utcp-websocket

# Example installation (Node.js)
npm install @utcp/websocket
```

## Call Template Structure

```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "message": {
    "type": "request",
    "action": "${action}",
    "data": "${data}"
  },
  "connection_timeout": 10,
  "response_timeout": 30,
  "auth": {
    "auth_type": "api_key",
    "api_key": "${WS_API_KEY}",
    "location": "query"
  }
}
```

## Configuration Options

The WebSocket call template enables real-time communication with WebSocket servers. For complete field specifications and validation rules, see the [WebSocket Call Template API Reference](../api/plugins/communication_protocols/websocket/src/utcp_websocket/websocket_call_template.md).
| `expected_responses` | number | Number of expected response messages (default: 1) |
| `ping_interval` | number | Ping interval in seconds (default: 30) |

## Authentication

WebSocket authentication can be handled in several ways:

### Query Parameter Authentication

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "token",
    "location": "query"
  }
}
```

### Header Authentication

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

### Message-based Authentication

```json
{
  "message": {
    "type": "auth",
    "token": "${API_KEY}"
  }
}
```

## Message Formats

### JSON Messages

```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "message": {
    "id": "{{uuid}}",
    "method": "getData",
    "params": {
      "query": "${query}",
      "limit": 10
    }
  }
}
```

### Text Messages

```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "message": "GET_DATA:${query}"
}
```

### Binary Messages

```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "message": {
    "type": "binary",
    "data": "${base64_data}"
  }
}
```

## Examples

### Real-time Data Subscription

```json
{
  "name": "subscribe_stock_price",
  "description": "Subscribe to real-time stock price updates",
  "inputs": {
    "type": "object",
    "properties": {
      "symbol": {"type": "string"},
      "duration": {"type": "number", "default": 60}
    },
    "required": ["symbol"]
  },
  "tool_call_template": {
    "call_template_type": "websocket",
    "url": "wss://api.stocks.com/ws",
    "message": {
      "action": "subscribe",
      "symbol": "${symbol}",
      "type": "price"
    },
    "response_timeout": "${duration}",
    "expected_responses": -1,
    "close_after_response": false
  }
}
```

### Chat Bot Integration

```json
{
  "name": "send_chat_message",
  "description": "Send a message to the chat bot",
  "inputs": {
    "type": "object",
    "properties": {
      "message": {"type": "string"},
      "user_id": {"type": "string"}
    },
    "required": ["message", "user_id"]
  },
  "tool_call_template": {
    "call_template_type": "websocket",
    "url": "wss://chat.example.com/ws",
    "message": {
      "type": "message",
      "user_id": "${user_id}",
      "content": "${message}",
      "timestamp": "{{now}}"
    },
    "headers": {
      "Authorization": "Bearer ${CHAT_TOKEN}"
    }
  }
}
```

### IoT Device Control

```json
{
  "name": "control_device",
  "description": "Send control commands to IoT device",
  "inputs": {
    "type": "object",
    "properties": {
      "device_id": {"type": "string"},
      "command": {"type": "string"},
      "value": {"type": "number"}
    },
    "required": ["device_id", "command"]
  },
  "tool_call_template": {
    "call_template_type": "websocket",
    "url": "wss://iot.example.com/device/${device_id}",
    "message": {
      "command": "${command}",
      "value": "${value}",
      "timestamp": "{{now}}"
    },
    "connection_timeout": 5,
    "response_timeout": 10
  }
}
```

## Connection Management

### Persistent Connections

For tools that need to maintain persistent connections:

```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "message": {"action": "ping"},
  "close_after_response": false,
  "ping_interval": 30
}
```

### Connection Pooling

The WebSocket protocol automatically manages connection pooling for efficiency:

- Reuses connections to the same endpoint
- Handles connection lifecycle automatically
- Implements reconnection logic for dropped connections

## Response Handling

### Single Response

```json
{
  "expected_responses": 1,
  "close_after_response": true
}
```

### Multiple Responses

```json
{
  "expected_responses": 5,
  "response_timeout": 60
}
```

### Streaming Responses

```json
{
  "expected_responses": -1,
  "response_timeout": 300,
  "close_after_response": false
}
```

## Error Handling

| Error Type | Description | Handling |
|------------|-------------|----------|
| Connection Failed | Cannot establish WebSocket connection | Raise `WebSocketConnectionError` |
| Authentication Failed | WebSocket handshake authentication failed | Raise `WebSocketAuthError` |
| Timeout | No response within timeout period | Raise `WebSocketTimeoutError` |
| Protocol Error | Invalid WebSocket protocol usage | Raise `WebSocketProtocolError` |
| Connection Closed | Server closed connection unexpectedly | Raise `WebSocketClosedError` |

## Best Practices

1. **Use Secure WebSockets**: Always use `wss://` for production
2. **Handle Reconnections**: Implement retry logic for connection failures
3. **Set Appropriate Timeouts**: Configure timeouts based on expected response times
4. **Validate Messages**: Validate both outgoing and incoming messages
5. **Monitor Connections**: Track connection health and performance
6. **Implement Heartbeats**: Use ping/pong for connection health checks
7. **Handle Backpressure**: Manage message queuing for high-throughput scenarios

## Advanced Features

### Message Filtering

Filter incoming messages based on criteria:

```json
{
  "call_template_type": "websocket",
  "url": "wss://api.example.com/ws",
  "message": {"subscribe": "all"},
  "message_filter": {
    "type": "stock_price",
    "symbol": "${symbol}"
  }
}
```

### Custom Headers

Include custom headers in the WebSocket handshake:

```json
{
  "headers": {
    "User-Agent": "UTCP-Client/1.0",
    "X-Client-ID": "${CLIENT_ID}",
    "Authorization": "Bearer ${TOKEN}"
  }
}
```

### Compression

Enable WebSocket compression:

```json
{
  "compression": "deflate",
  "compression_threshold": 1024
}
```

## Common Use Cases

- **Real-time Data**: Stock prices, sensor data, live metrics
- **Chat Applications**: Messaging, notifications, presence
- **Gaming**: Real-time game state, multiplayer coordination
- **IoT Control**: Device commands, status updates
- **Live Updates**: News feeds, social media streams
- **Collaborative Tools**: Document editing, shared whiteboards

## Protocol Comparison

| Feature | WebSocket | HTTP | SSE |
|---------|-----------|------|-----|
| Bidirectional | ✅ | ❌ | ❌ |
| Real-time | ✅ | ❌ | ✅ |
| Persistent | ✅ | ❌ | ✅ |
| Overhead | Low | High | Medium |
| Complexity | Medium | Low | Low |
