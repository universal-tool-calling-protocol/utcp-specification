---
id: protocols
title: Protocols
sidebar_position: 4
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
```json
{
  "call_template_type": "http",
  "url": "https://api.example.com/endpoint",
  "http_method": "POST",
  "headers": {"Content-Type": "application/json"}
}
```

### Communication Protocols
Handle the actual communication logic for each protocol type. The implementation varies by programming language.

## Installing Protocol Plugins

Protocol plugins are available for different programming languages:

```bash
# Example installation (Python)
pip install utcp-http utcp-cli utcp-websocket utcp-text utcp-mcp

# Example installation (Node.js)
npm install @utcp/http @utcp/cli @utcp/websocket @utcp/text @utcp/mcp
```

For other languages, check the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)

## Creating Custom Protocol Plugins

You can extend UTCP with custom communication protocols by implementing the protocol interface in your chosen language. Each implementation must:

1. **Define Call Templates**: Specify the structure for protocol-specific calls
2. **Implement Communication Handler**: Handle the actual protocol communication
3. **Register the Protocol**: Make it available to the UTCP client

Example call template structure:
```json
{
  "call_template_type": "custom",
  "custom_field": "value",
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}"
  }
}
```

## Protocol Selection Guide

Choose the right protocol plugin based on your needs:

- **HTTP**: Most common for REST APIs and web services
- **WebSocket**: Real-time bidirectional communication
- **CLI**: Wrapping existing command-line tools
- **SSE**: Server-sent events for streaming data
- **Text**: Reading configuration files or static content
- **MCP**: Interoperability with Model Context Protocol tools

## Language-Specific Documentation

For implementation details and examples in your programming language:

- **Multi-language**: [UTCP Implementation Examples](https://github.com/universal-tool-calling-protocol) - Examples across Python, TypeScript, Go, and other languages
- **TypeScript**: [TypeScript UTCP Documentation](https://github.com/universal-tool-calling-protocol/typescript-utcp/tree/main/docs)
- **Other languages**: Check respective repositories in the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)

For detailed information about each protocol plugin, see the individual protocol documentation pages.
