---
id: websocket
title: WebSocket Provider
sidebar_position: 5
---

# WebSocket Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.
:::
The WebSocket provider enables bidirectional, real-time communication between agents and tools, making it ideal for applications that require persistent connections and low-latency data exchange.

## Configuration

WebSocket providers are configured using the following JSON structure:

```json
{
  "name": "realtime_chat_service",
  "provider_type": "websocket",
  "url": "wss://api.example.com/socket",
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "token"
  }
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"websocket"` |
| `url` | Yes | WebSocket URL (`ws://` or `wss://`) |
| `protocol` | No | WebSocket sub-protocol to use |
| `keep_alive` | No | Whether to keep the connection alive (default: `true`) |
| `auth` | No | Authentication configuration (if required) |
| `headers` | No | Additional HTTP headers to include in the WebSocket handshake |
| `header_fields` | No | List of input fields to be sent as request headers for the initial connection |

## Tool Discovery

Since WebSockets don't naturally support the request-response pattern needed for tool discovery, there are two approaches:

1. **HTTP Discovery Endpoint**: Provide a separate HTTP endpoint (typically `/utcp`) that returns the tool definitions
2. **Initial WebSocket Message**: After connecting, the client sends a discovery message and the server responds with tool definitions

For the HTTP discovery approach:

```json
{
  "name": "realtime_chat_service",
  "provider_type": "websocket",
  "url": "wss://api.example.com/socket",
  "discovery_url": "https://api.example.com/utcp"
}
```

## Message Format

Messages sent over the WebSocket connection should follow a standard format:

```json
{
  "type": "call",
  "tool": "tool_name",
  "id": "unique_request_id",
  "params": {
    // Tool parameters go here
  }
}
```

Response messages should include:

```json
{
  "type": "result",
  "id": "unique_request_id",
  "result": {
    // Tool result data goes here
  }
}
```

For streaming results, the server can send multiple messages with the same `id` and a `partial: true` flag, with the final message having `partial: false`.

## Authentication

WebSocket providers typically handle authentication in one of these ways:

1. **URL Query Parameters**: Adding authentication tokens to the URL
   ```
   wss://api.example.com/socket?token=YOUR_API_KEY
   ```

2. **Authentication Message**: Sending credentials after connection is established
   ```json
   {
     "type": "auth",
     "token": "$YOUR_API_KEY"
   }
   ```

3. **Headers (for initial HTTP handshake)**: Adding authentication headers to the WebSocket handshake

## Making Tool Calls

When a tool associated with a WebSocket provider is called, the UTCP client will:

1. Establish a WebSocket connection to the specified URL (if not already connected)
2. Send the tool call as a message over the connection
3. Wait for the response message(s) that match the request ID
4. Parse the response according to the tool's output schema

## Examples

### Chat Application

```json
{
  "name": "chat_service",
  "provider_type": "websocket",
  "url": "wss://chat.example.com/socket"
}
```

Tool call:
```json
{
  "type": "call",
  "tool": "send_message",
  "id": "msg123",
  "params": {
    "channel": "general",
    "text": "Hello everyone!"
  }
}
```

### Real-time Data Feed

```json
{
  "name": "market_data",
  "provider_type": "websocket",
  "url": "wss://markets.example.com/feed",
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "token"
  }
}
```

Subscription request:
```json
{
  "type": "call",
  "tool": "subscribe_ticker",
  "id": "sub456",
  "params": {
    "symbol": "AAPL",
    "fields": ["price", "volume"]
  }
}
```

## Best Practices

1. **Handle Reconnection**: Implement automatic reconnection with backoff strategy
2. **Heartbeats**: Use ping/pong messages to keep connections alive
3. **Message Ordering**: Track message IDs to handle out-of-order responses
4. **Error Handling**: Define standard error message format and recovery procedures
5. **Resource Management**: Limit the number of simultaneous connections

## Common Issues

| Issue | Solution |
|-------|----------|
| Connection drops | Implement automatic reconnection with exponential backoff |
| Message ordering | Use sequence numbers or timestamps to track message order |
| Connection limits | Pool WebSocket connections when possible |
| Firewalls | Ensure WebSocket traffic is allowed (port 443 for WSS is usually open) |

WebSocket providers offer significant advantages for real-time applications but require more complex client-side handling than simpler request-response protocols like HTTP.
