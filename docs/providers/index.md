---
id: index
title: Communication Protocols
sidebar_position: 3
---

# Communication Protocols

UTCP supports multiple communication protocols through its plugin architecture. Each protocol plugin provides the necessary implementation to call tools using that specific transport method.

## Available Protocols

### Core Protocols

| Protocol | Plugin | Status | Description |
|----------|--------|--------|-------------|
| [HTTP](./http.md) | `utcp-http` | ✅ Stable | REST APIs, webhooks, and standard HTTP services |
| [Server-Sent Events](./sse.md) | `utcp-http` | ✅ Stable | Real-time streaming over HTTP |
| [WebSocket](./websocket.md) | `utcp-websocket` | ✅ Stable | Bidirectional real-time communication |
| [CLI](./cli.md) | `utcp-cli` | ✅ Stable | Command-line tools and scripts |
| [Text Files](./text.md) | `utcp-text` | ✅ Stable | Reading local and remote text files |

### Integration Protocols

| Protocol | Plugin | Status | Description |
|----------|--------|--------|-------------|
| [MCP](./mcp.md) | `utcp-mcp` | ✅ Stable | Model Context Protocol interoperability |

### Experimental Protocols

| Protocol | Plugin | Status | Description |
|----------|--------|--------|-------------|
| [GraphQL](./graphql.md) | `utcp-gql` | 🚧 Beta | GraphQL APIs and subscriptions |
| [gRPC](./grpc.md) | `utcp-grpc` | 🚧 Beta | High-performance RPC calls |
| [TCP](./tcp.md) | `utcp-socket` | 🚧 Beta | Raw TCP socket connections |
| [UDP](./udp.md) | `utcp-socket` | 🚧 Beta | UDP packet-based communication |

## Protocol Selection Guide

Choose the right protocol based on your tool's characteristics:

### Use HTTP when:
- Your tool is a REST API
- You need simple request/response patterns
- You want maximum compatibility

### Use WebSocket when:
- You need bidirectional communication
- Your tool provides real-time updates
- You want persistent connections

### Use CLI when:
- Your tool is a command-line application
- You need to execute local scripts
- You're wrapping existing CLI tools

### Use SSE when:
- You need server-to-client streaming
- You want real-time updates over HTTP
- You need simple event streaming

## Plugin Architecture

UTCP's plugin system allows you to:

1. **Extend existing protocols** with custom authentication or data transformation
2. **Create new protocols** for specialized communication needs
3. **Combine protocols** for complex tool interactions

### Creating Custom Protocols

To create a custom protocol plugin, implement the [`CommunicationProtocol`](../api/core/utcp/interfaces/communication_protocol.md) interface:

```python
from utcp.interfaces.communication_protocol import CommunicationProtocol
from utcp.data.call_template import CallTemplate

class MyCustomProtocol(CommunicationProtocol):
    def get_supported_call_template_types(self) -> List[str]:
        return ["my_custom_protocol"]
    
    async def call_tool(self, call_template: CallTemplate, tool_args: Dict[str, Any]) -> Any:
        # Implement your protocol logic here
        pass
```

## Next Steps

- Choose a protocol from the list above
- Read the specific protocol documentation
- Check out the [API Reference](../api/index.md) for implementation details
- See [Examples](../examples/index.md) for practical implementations
