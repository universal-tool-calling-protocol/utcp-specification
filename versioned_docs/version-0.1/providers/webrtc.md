---
id: webrtc
title: WebRTC Provider
sidebar_position: 10
---

# WebRTC Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.
:::
The WebRTC provider enables UTCP to establish peer-to-peer connections for real-time communication, allowing for direct data exchange between clients without requiring a central server for data transfer.

## Configuration

WebRTC providers are configured using the following JSON structure:

```json
{
  "name": "p2p_service",
  "provider_type": "webrtc",
  "signaling_server": "wss://signaling.example.com/socket",
  "peer_id": "server-endpoint-123",
  "data_channel_name": "tools"
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"webrtc"` |
| `signaling_server` | Yes | WebSocket URL of the signaling server |
| `peer_id` | Yes | ID of the peer to connect to |
| `data_channel_name` | No | Name of the data channel (default: `"tools"`) |

## Signaling Process

WebRTC requires a signaling mechanism to establish connections. The process typically works as follows:

1. Both peers connect to the signaling server
2. The client initiates a connection request with an offer
3. The server responds with an answer
4. ICE candidates are exchanged to establish the best connection path
5. Once the connection is established, data flows directly between peers

## Tool Discovery

For WebRTC providers, tool discovery can happen in two ways:

1. **Via Signaling Server**: The initial tool definitions are provided through the signaling server
2. **After Connection**: Tool definitions are requested after the WebRTC connection is established

## Making Tool Calls

When a tool associated with a WebRTC provider is called, the UTCP client will:

1. Establish or use an existing WebRTC connection to the specified peer
2. Send the serialized input parameters through the data channel
3. Wait for a response on the data channel
4. Process the response according to the tool's output schema

## Message Format

Messages sent over the WebRTC data channel should follow a standard format:

```json
{
  "type": "tool_call",
  "tool": "tool_name",
  "id": "unique-call-id",
  "inputs": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

Responses follow a similar structure:

```json
{
  "type": "tool_response",
  "tool": "tool_name",
  "id": "unique-call-id",
  "output": {
    "result": "value"
  }
}
```

## Examples

### Collaborative Editing

```json
{
  "name": "document_collaboration",
  "provider_type": "webrtc",
  "signaling_server": "wss://collab.example.com/signal",
  "peer_id": "doc-server-456",
  "data_channel_name": "document"
}
```

Tool definition:
```json
{
  "name": "sync_changes",
  "description": "Synchronize document changes with peers",
  "inputs": {
    "type": "object",
    "properties": {
      "document_id": {
        "type": "string",
        "description": "ID of the document being edited"
      },
      "changes": {
        "type": "array",
        "description": "List of changes to apply",
        "items": {
          "type": "object",
          "properties": {
            "op": {
              "type": "string",
              "enum": ["insert", "delete", "replace"]
            },
            "path": {
              "type": "string"
            },
            "value": {
              "type": "string"
            }
          }
        }
      },
      "revision": {
        "type": "integer",
        "description": "Current revision number"
      }
    },
    "required": ["document_id", "changes", "revision"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "success": {
        "type": "boolean",
        "description": "Whether the changes were applied"
      },
      "new_revision": {
        "type": "integer",
        "description": "New revision number"
      },
      "conflicts": {
        "type": "array",
        "description": "Conflicts that occurred, if any"
      }
    }
  }
}
```

## Best Practices

1. **Connection Management**: Maintain long-lived connections for frequent interactions
2. **ICE Configuration**: Configure appropriate STUN/TURN servers for NAT traversal
3. **Reliability**: Use reliable mode for the data channel when ordering and delivery guarantees are required
4. **Security**: Use DTLS for encryption of WebRTC traffic
5. **Fallback Mechanism**: Implement fallback to alternative providers if WebRTC connection fails

WebRTC providers are ideal for peer-to-peer applications, real-time collaboration, and scenarios where direct communication between clients is preferable to routing through a server.
