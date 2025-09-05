---
id: index
title: Communication Protocol Plugins
sidebar_position: 3
---

# Communication Protocol Plugins

UTCP v1.0 features a modular, plugin-based architecture where different communication protocols are implemented as separate plugins. Each protocol plugin provides call templates and communication handlers for specific transport methods.

## Available Protocol Plugins

| Protocol | Plugin Package | Call Template | Use Cases |
|----------|----------------|---------------|-----------|
| **[HTTP](./http.md)** | `utcp-http` | `HttpCallTemplate` | REST APIs, webhooks, web services |
| **[WebSocket](./websocket.md)** | `utcp-websocket` | `WebSocketCallTemplate` | Real-time communication, streaming |
| **[CLI](./cli.md)** | `utcp-cli` | `CliCallTemplate` | Command-line tools, scripts |
| **[Server-Sent Events](./sse.md)** | `utcp-http` | `SseCallTemplate` | Event streaming, live updates |
| **[Text Files](./text.md)** | `utcp-text` | `TextCallTemplate` | File reading, static content |
| **[MCP](./mcp.md)** | `utcp-mcp` | `McpCallTemplate` | Model Context Protocol interop |

## Plugin Architecture

Each protocol plugin consists of:

### Call Templates
Define how to structure calls for the specific protocol:
```python
# Example: HTTP Call Template
{
  "call_template_type": "http",
  "url": "https://api.example.com/endpoint",
  "http_method": "POST",
  "headers": {"Content-Type": "application/json"}
}
```

### Communication Protocols
Handle the actual communication logic:
```python
class HttpCommunicationProtocol:
    async def call_tool(self, call_template, tool_args):
        # Implementation for HTTP calls
        pass
```

## Installing Protocol Plugins

```bash
# Core UTCP library
pip install utcp

# Install specific protocol plugins
pip install utcp-http      # HTTP, SSE protocols
pip install utcp-cli       # CLI protocol
pip install utcp-websocket # WebSocket protocol
pip install utcp-text      # Text file protocol
pip install utcp-mcp       # MCP interoperability
```

## Creating Custom Protocol Plugins

You can extend UTCP with custom communication protocols:

```python
from utcp.interfaces.communication_protocol import CommunicationProtocol
from utcp.data.call_template import CallTemplate

class CustomCallTemplate(CallTemplate):
    call_template_type: str = "custom"
    custom_field: str

class CustomCommunicationProtocol(CommunicationProtocol):
    async def call_tool(self, call_template: CustomCallTemplate, tool_args: dict):
        # Your custom protocol implementation
        pass

# Register the protocol
from utcp.plugins.discovery import register_communication_protocol
register_communication_protocol(CustomCommunicationProtocol())
```

## Protocol Selection Guide

Choose the right protocol plugin based on your needs:

- **HTTP**: Most common for REST APIs and web services
- **WebSocket**: Real-time bidirectional communication
- **CLI**: Wrapping existing command-line tools
- **SSE**: Server-sent events for streaming data
- **Text**: Reading configuration files or static content
- **MCP**: Interoperability with Model Context Protocol tools

For detailed information about each protocol plugin, see the individual protocol documentation pages.
