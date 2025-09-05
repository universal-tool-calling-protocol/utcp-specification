---
id: mcp
title: Model Context Protocol (MCP)
sidebar_position: 6
---

# Model Context Protocol (MCP)

The MCP protocol plugin (`utcp-mcp`) provides interoperability with the Model Context Protocol, allowing UTCP clients to call tools exposed through MCP servers. This enables gradual migration from MCP to UTCP or hybrid deployments.

## Installation

```bash
pip install utcp-mcp
```

## Call Template Structure

```json
{
  "call_template_type": "mcp",
  "server_config": {
    "command": "node",
    "args": ["/path/to/mcp-server.js"],
    "env": {
      "API_KEY": "${API_KEY}"
    }
  },
  "tool_name": "${tool_name}",
  "connection_timeout": 30,
  "call_timeout": 60
}
```

## Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `call_template_type` | string | Must be `"mcp"` |
| `server_config` | object | MCP server configuration |
| `tool_name` | string | Name of the MCP tool to call |

### Server Configuration

| Field | Type | Description |
|-------|------|-------------|
| `command` | string | Command to start MCP server |
| `args` | array | Command arguments |
| `env` | object | Environment variables |
| `cwd` | string | Working directory |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `connection_timeout` | number | Server connection timeout (default: 30) |
| `call_timeout` | number | Tool call timeout (default: 60) |
| `server_name` | string | Friendly name for the server |
| `auto_restart` | boolean | Auto-restart server on failure (default: true) |

## Examples

### File System MCP Server

```json
{
  "name": "read_file_mcp",
  "description": "Read file content via MCP filesystem server",
  "inputs": {
    "type": "object",
    "properties": {
      "path": {"type": "string"}
    },
    "required": ["path"]
  },
  "tool_call_template": {
    "call_template_type": "mcp",
    "server_config": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"],
      "env": {}
    },
    "tool_name": "read_file"
  }
}
```

### Database MCP Server

```json
{
  "name": "query_database_mcp",
  "description": "Query database via MCP server",
  "inputs": {
    "type": "object",
    "properties": {
      "query": {"type": "string"},
      "params": {"type": "array"}
    },
    "required": ["query"]
  },
  "tool_call_template": {
    "call_template_type": "mcp",
    "server_config": {
      "command": "python",
      "args": ["-m", "mcp_server_sqlite", "--db-path", "/data/app.db"],
      "env": {
        "DATABASE_URL": "${DATABASE_URL}"
      }
    },
    "tool_name": "execute_query",
    "call_timeout": 120
  }
}
```

### Custom MCP Server

```json
{
  "name": "custom_mcp_tool",
  "description": "Call custom MCP server tool",
  "inputs": {
    "type": "object",
    "properties": {
      "input_data": {"type": "object"}
    },
    "required": ["input_data"]
  },
  "tool_call_template": {
    "call_template_type": "mcp",
    "server_config": {
      "command": "node",
      "args": ["./custom-mcp-server.js"],
      "cwd": "/app/servers",
      "env": {
        "NODE_ENV": "production",
        "API_KEY": "${MCP_API_KEY}"
      }
    },
    "tool_name": "process_data",
    "server_name": "custom_processor"
  }
}
```

## Server Management

### Automatic Server Lifecycle

The MCP protocol plugin automatically manages server lifecycle:

1. **Startup**: Launches MCP server when first tool is called
2. **Connection**: Establishes JSON-RPC connection
3. **Tool Discovery**: Retrieves available tools from server
4. **Call Routing**: Routes tool calls to appropriate server
5. **Shutdown**: Gracefully shuts down server when no longer needed

### Server Pooling

Multiple tools can share the same MCP server instance:

```json
{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "tools": [
    {
      "name": "list_files",
      "tool_call_template": {
        "call_template_type": "mcp",
        "server_config": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data"]
        },
        "tool_name": "list_directory"
      }
    },
    {
      "name": "read_file",
      "tool_call_template": {
        "call_template_type": "mcp",
        "server_config": {
          "command": "npx",
          "args": ["-y", "@modelcontextprotocol/server-filesystem", "/data"]
        },
        "tool_name": "read_file"
      }
    }
  ]
}
```

## Error Handling

| Error Type | Description | Handling |
|------------|-------------|----------|
| Server Start Failed | Cannot start MCP server | Raise `MCPServerStartError` |
| Connection Failed | Cannot connect to server | Raise `MCPConnectionError` |
| Tool Not Found | Tool doesn't exist on server | Raise `MCPToolNotFoundError` |
| Call Timeout | Tool call exceeded timeout | Raise `MCPTimeoutError` |
| Server Crashed | MCP server process died | Auto-restart if enabled |

## Migration from MCP

### Gradual Migration Strategy

1. **Wrap Existing MCP Servers**: Use UTCP-MCP plugin to call existing servers
2. **Identify High-Value Tools**: Prioritize frequently used tools for direct migration
3. **Migrate Tool by Tool**: Convert individual tools to native UTCP protocols
4. **Deprecate MCP Servers**: Remove MCP dependency once migration is complete

### Migration Example

**Before (Pure MCP):**
```javascript
// MCP Client
const client = new MCPClient();
await client.connect("filesystem-server");
const result = await client.callTool("read_file", {path: "/data/file.txt"});
```

**During Migration (UTCP with MCP):**
```python
# UTCP Client with MCP plugin
client = await UtcpClient.create()
result = await client.call_tool("filesystem.read_file", {
    "path": "/data/file.txt"
})
```

**After Migration (Pure UTCP):**
```python
# UTCP Client with native protocol
client = await UtcpClient.create()
result = await client.call_tool("filesystem.read_file", {
    "path": "/data/file.txt"
})
```

## Best Practices

1. **Server Reuse**: Share MCP servers across multiple tools when possible
2. **Timeout Configuration**: Set appropriate timeouts for server startup and calls
3. **Error Handling**: Implement retry logic for transient server failures
4. **Resource Management**: Monitor server resource usage and lifecycle
5. **Migration Planning**: Plan gradual migration to native UTCP protocols
6. **Testing**: Test MCP server compatibility thoroughly
7. **Documentation**: Document MCP server dependencies and requirements

## Performance Considerations

### Overhead Comparison

| Aspect | Native UTCP | UTCP-MCP | Pure MCP |
|--------|-------------|----------|----------|
| Latency | Low | Medium | Medium |
| Memory Usage | Low | Medium | High |
| Process Overhead | None | Medium | High |
| Network Hops | 1 | 2 | 2 |

### Optimization Tips

1. **Server Pooling**: Reuse servers across multiple tools
2. **Connection Caching**: Cache server connections
3. **Batch Operations**: Group related tool calls when possible
4. **Resource Limits**: Set memory and CPU limits for MCP servers
5. **Health Monitoring**: Monitor server health and performance

## Compatibility

### Supported MCP Versions

- MCP 1.0.x: ✅ Full support
- MCP 0.x: ⚠️ Limited support

### Known Limitations

1. **Streaming**: MCP streaming not fully supported
2. **Resources**: MCP resources not mapped to UTCP
3. **Prompts**: MCP prompts not supported
4. **Sampling**: MCP sampling not supported

## Common Use Cases

- **Legacy Integration**: Calling existing MCP servers
- **Gradual Migration**: Transitioning from MCP to UTCP
- **Hybrid Deployments**: Using both MCP and UTCP tools
- **Third-party Tools**: Accessing MCP-only tools
- **Development**: Testing MCP compatibility

## Troubleshooting

### Server Won't Start

```bash
# Check server command manually
npx -y @modelcontextprotocol/server-filesystem /path

# Verify environment variables
echo $API_KEY

# Check file permissions
ls -la /path/to/mcp-server.js
```

### Connection Issues

```python
# Enable debug logging
import logging
logging.getLogger('utcp.mcp').setLevel(logging.DEBUG)

# Test connection timeout
{
  "connection_timeout": 60,  # Increase timeout
  "auto_restart": true       # Enable auto-restart
}
```

### Tool Not Found

```python
# List available tools from MCP server
server_tools = await mcp_client.list_tools()
print(f"Available tools: {[tool.name for tool in server_tools]}")
```

## Related Documentation

- [UTCP vs MCP Comparison](../utcp-vs-mcp.md)
- [Migration Guide](../migration/from-mcp.md)
- [HTTP Protocol](./http.md) - Alternative to MCP for REST APIs
- [CLI Protocol](./cli.md) - Alternative to MCP for command-line tools
