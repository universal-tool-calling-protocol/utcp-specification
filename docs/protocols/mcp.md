---
id: mcp
title: MCP Protocol
sidebar_position: 6
---

# MCP Protocol Plugin

The MCP (Model Context Protocol) plugin provides interoperability between UTCP and existing MCP servers, enabling gradual migration from MCP to UTCP while maintaining compatibility with existing MCP tools.

## Call Template Structure

```json
{
  "call_template_type": "mcp",
  "server_config": {
    "command": "node",
    "args": ["mcp-server.js"],
    "working_directory": "/app/mcp",
    "env": {
      "NODE_ENV": "production",
      "LOG_LEVEL": "info"
    },
    "timeout": 30
  },
  "connection_timeout": 10,
  "request_timeout": 30
}
```

## Server Configuration

### Command-based Servers
```json
{
  "server_config": {
    "command": "python",
    "args": ["-m", "mcp_server", "--config", "config.json"],
    "working_directory": "/app",
    "env": {
      "PYTHONPATH": "/app/lib",
      "API_KEY": "${MCP_API_KEY}"
    }
  }
}
```

### HTTP-based Servers
```json
{
  "server_config": {
    "transport": "http",
    "url": "http://localhost:8080/mcp",
    "headers": {
      "Authorization": "Bearer ${MCP_TOKEN}"
    }
  }
}
```

## Migration Strategy

The MCP protocol plugin enables a gradual migration path from MCP to native UTCP protocols:

### Phase 1: MCP Integration
- Use existing MCP servers through UTCP
- No changes to MCP server code required
- UTCP client can call MCP tools seamlessly

### Phase 2: Hybrid Approach
- Some tools use native UTCP protocols
- Legacy tools continue using MCP
- Gradual migration of high-value tools

### Phase 3: Full Migration
- All tools use native UTCP protocols
- MCP servers deprecated
- Simplified architecture

## Tool Discovery

MCP servers expose tools through the standard MCP protocol. The UTCP MCP plugin:

1. **Connects** to the MCP server using stdio or HTTP transport
2. **Discovers** available tools via MCP's `tools/list` method
3. **Maps** MCP tool definitions to UTCP tool format
4. **Registers** tools in the UTCP client

## Request/Response Mapping

### MCP to UTCP Tool Mapping
```json
// MCP Tool Definition
{
  "name": "read_file",
  "description": "Read contents of a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {"type": "string"}
    },
    "required": ["path"]
  }
}

// UTCP Tool (after mapping)
{
  "name": "read_file",
  "description": "Read contents of a file",
  "inputs": {
    "type": "object",
    "properties": {
      "path": {"type": "string"}
    },
    "required": ["path"]
  },
  "tool_call_template": {
    "call_template_type": "mcp",
    "server_config": {...}
  }
}
```

### Request Flow
1. UTCP client receives tool call
2. MCP plugin formats request as MCP `tools/call`
3. Request sent to MCP server
4. MCP server processes and responds
5. Response mapped back to UTCP format

## Authentication and Security

### Server Authentication
```json
{
  "server_config": {
    "command": "secure-mcp-server",
    "env": {
      "MCP_AUTH_TOKEN": "${MCP_SERVER_TOKEN}",
      "MCP_CLIENT_ID": "${MCP_CLIENT_ID}"
    }
  }
}
```

### Transport Security
- **stdio**: Inherits process security model
- **HTTP**: Use HTTPS and proper authentication headers
- **WebSocket**: Use WSS and authentication tokens

## Error Handling

### Connection Errors
- Server startup failures
- Network connectivity issues
- Authentication failures
- Timeout errors

### Protocol Errors
- Invalid MCP messages
- Unsupported MCP features
- Tool execution failures
- Resource access errors

### Error Mapping
MCP errors are mapped to UTCP exceptions:
- `InvalidRequest` → `ValidationError`
- `MethodNotFound` → `ToolNotFoundError`
- `InternalError` → `ToolCallError`

## Performance Considerations

### Connection Management
- Persistent connections for stdio transport
- Connection pooling for HTTP transport
- Automatic reconnection on failures
- Graceful shutdown handling

### Request Optimization
- Batch multiple tool calls when possible
- Cache tool discovery results
- Implement request timeouts
- Monitor response times

## Limitations

### MCP Feature Support
Not all MCP features are supported through UTCP:
- **Resources**: Not directly mapped to UTCP tools
- **Prompts**: Not supported in UTCP model
- **Sampling**: Not applicable to tool calling

### Protocol Differences
- MCP's bidirectional communication vs UTCP's request/response
- MCP's resource model vs UTCP's tool-only model
- Different authentication mechanisms

## Configuration Examples

### Development Setup
```json
{
  "manual_call_templates": [{
    "name": "dev_mcp",
    "call_template_type": "mcp",
    "server_config": {
      "command": "node",
      "args": ["dev-server.js"],
      "env": {"NODE_ENV": "development"}
    },
    "connection_timeout": 5,
    "request_timeout": 10
  }]
}
```

### Production Setup
```json
{
  "manual_call_templates": [{
    "name": "prod_mcp",
    "call_template_type": "mcp",
    "server_config": {
      "transport": "http",
      "url": "https://mcp.example.com/api",
      "headers": {
        "Authorization": "Bearer ${MCP_PROD_TOKEN}",
        "X-Client-Version": "1.0.0"
      }
    },
    "connection_timeout": 30,
    "request_timeout": 60
  }]
}
```

## Best Practices

### Migration Planning
1. **Inventory** existing MCP servers and tools
2. **Prioritize** tools for migration based on usage
3. **Test** MCP integration thoroughly
4. **Monitor** performance and reliability
5. **Migrate** incrementally to native UTCP protocols

### Monitoring and Debugging
- Enable debug logging for MCP communication
- Monitor server health and response times
- Track tool usage patterns
- Log authentication failures
- Set up alerts for connection issues

### Security
- Use secure transport methods (HTTPS, WSS)
- Implement proper authentication
- Validate all inputs and outputs
- Monitor for suspicious activity
- Keep MCP servers updated

## Language-Specific Implementation

For implementation details and examples in your programming language:

- **Multi-language**: [UTCP MCP Protocol Examples](https://github.com/universal-tool-calling-protocol) - MCP protocol examples across multiple languages
- **TypeScript**: [TypeScript MCP Protocol Documentation](https://github.com/universal-tool-calling-protocol/typescript-utcp/blob/main/docs/protocols/mcp.md)
- **Other languages**: Check respective repositories in the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol)
