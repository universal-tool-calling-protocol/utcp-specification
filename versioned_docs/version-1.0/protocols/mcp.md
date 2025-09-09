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
  "config": {
    "mcpServers": {
      "filesystem": {
        "command": "node",
        "args": ["mcp-server.js"],
        "cwd": "/app/mcp",
        "env": {
          "NODE_ENV": "production",
          "LOG_LEVEL": "info"
        }
      }
    }
  },
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "read:tools"
  },
  "register_resources_as_tools": false
}
```

## Field Descriptions

For detailed field specifications, examples, and validation rules, see:
- **[McpCallTemplate API Reference](../api/plugins/communication_protocols/mcp/src/utcp_mcp/mcp_call_template.md)** - Complete field documentation with examples
- **[McpCommunicationProtocol API Reference](../api/plugins/communication_protocols/mcp/src/utcp_mcp/mcp_communication_protocol.md)** - Implementation details and method documentation

### Key Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `call_template_type` | string | Yes | - | Always "mcp" for MCP providers |
| `config` | object | Yes | - | Configuration object containing MCP server definitions |
| `auth` | object | No | null | Optional OAuth2 authentication for HTTP-based MCP servers |
| `register_resources_as_tools` | boolean | No | false | Whether to register MCP resources as callable tools |

## Server Configuration

### Command-based (stdio) Servers
```json
{
  "config": {
    "mcpServers": {
      "my_server": {
        "command": "python",
        "args": ["-m", "mcp_server", "--config", "config.json"],
        "cwd": "/app",
        "env": {
          "PYTHONPATH": "/app/lib",
          "API_KEY": "${MCP_API_KEY}"
        }
      }
    }
  }
}
```

### HTTP-based Servers
```json
{
  "config": {
    "mcpServers": {
      "remote_server": {
        "transport": "http",
        "url": "https://mcp.example.com/api"
      }
    }
  },
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "mcp:access"
  }
}
```

### Multiple Servers
```json
{
  "config": {
    "mcpServers": {
      "filesystem": {
        "command": "node",
        "args": ["filesystem-server.js"]
      },
      "database": {
        "command": "python",
        "args": ["-m", "db_server"]
      },
      "remote_api": {
        "transport": "http",
        "url": "https://api.example.com/mcp"
      }
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

The MCP protocol implementation automatically discovers and maps tools:

1. **Session Management**: Creates persistent sessions with MCP servers using MCPClient
2. **Tool Discovery**: Lists available tools via MCP's `list_tools` method
3. **Tool Prefixing**: Adds server name prefix (e.g., `filesystem.read_file`) to ensure uniqueness
4. **Resource Support**: Optionally registers MCP resources as callable tools when `register_resources_as_tools` is true
5. **Tool Mapping**: Converts MCP tool schema to UTCP tool format automatically

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
  "name": "filesystem.read_file",
  "description": "Read contents of a file",
  "input_schema": {
    "type": "object",
    "properties": {
      "path": {"type": "string"}
    },
    "required": ["path"]
  },
  "tool_call_template": {
    "call_template_type": "mcp",
    "config": {
      "mcpServers": {...}
    }
  }
}
```

### Request Flow
1. UTCP client receives tool call with server-prefixed name (e.g., `filesystem.read_file`)
2. MCP plugin extracts server name and tool name
3. Gets or creates session with target MCP server
4. Calls MCP server's `call_tool` method
5. Processes response content (text, JSON, structured output)
6. Returns mapped result to UTCP client

### Response Processing
The implementation intelligently processes MCP responses:
- **Structured output**: Returns `result.structured_output` if available
- **Text content**: Attempts JSON parsing, number parsing, or returns as string
- **List content**: Processes each item and returns as list or single item
- **Error handling**: Session-level errors trigger session restart

## Authentication

### OAuth2 Authentication (HTTP Servers)
```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "mcp:read mcp:write"
  }
}
```

### Environment-based Authentication (stdio Servers)
```json
{
  "config": {
    "mcpServers": {
      "secure_server": {
        "command": "secure-mcp-server",
        "env": {
          "MCP_AUTH_TOKEN": "${MCP_SERVER_TOKEN}",
          "MCP_CLIENT_ID": "${MCP_CLIENT_ID}"
        }
      }
    }
  }
}
```

### Security Features
- **OAuth2 token caching**: Tokens cached by client_id to avoid repeated requests
- **Session management**: Persistent sessions with automatic error recovery
- **Environment variables**: Use `${VAR_NAME}` syntax for sensitive credentials
- **Transport security**: stdio inherits process security, HTTP supports OAuth2

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

### Current Limitations
- **Prompts**: Not supported in UTCP model
- **Sampling**: Not applicable to tool calling
- **Streaming**: MCP streaming calls return single result (no streaming support)

### MCP Feature Support
Full support for core MCP features:
- **Tools**: Complete tool discovery and execution support
- **Resources**: Optional support via `register_resources_as_tools` flag
- **Authentication**: OAuth2 support for HTTP-based servers
- **Session management**: Persistent sessions with automatic recovery
- **Multiple servers**: Single provider can manage multiple MCP servers

### Protocol Mapping
- **Tool naming**: Server-prefixed names ensure uniqueness across multiple servers
- **Response processing**: Intelligent parsing of MCP response formats
- **Error handling**: Session-level vs protocol-level error distinction
- **Resource tools**: Resources exposed as callable tools when enabled

## Configuration Examples

### Development Setup
```json
{
  "name": "dev_mcp",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "filesystem": {
        "command": "node",
        "args": ["dev-server.js"],
        "env": {"NODE_ENV": "development"}
      },
      "database": {
        "command": "python",
        "args": ["-m", "db_server", "--dev"]
      }
    }
  },
  "register_resources_as_tools": true
}
```

### Production Setup
```json
{
  "name": "prod_mcp",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "api_server": {
        "transport": "http",
        "url": "https://mcp.example.com/api"
      }
    }
  },
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${MCP_CLIENT_ID}",
    "client_secret": "${MCP_CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "mcp:access"
  },
  "register_resources_as_tools": false
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

## Implementation Notes

The MCP protocol implementation provides:

- **Session persistence**: Reuses MCP sessions for better performance
- **Automatic recovery**: Handles session failures with automatic retry
- **Multi-server support**: Single provider manages multiple MCP servers
- **Resource integration**: Optional resource-to-tool mapping
- **OAuth2 support**: Full OAuth2 authentication for HTTP servers
- **Intelligent response processing**: Handles various MCP response formats

### Usage Example
```python
import asyncio
from utcp_client import UtcpClient

async def main():
    client = UtcpClient()
    
    # Register MCP provider with multiple servers
    await client.register_tool_provider(mcp_manual)
    
    # Call tools with server-prefixed names
    result = await client.call_tool("filesystem.read_file", {"path": "/data/file.txt"})
    
    # Access resources as tools (if enabled)
    resource_data = await client.call_tool("filesystem.resource_config", {})
    
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```

## Related Protocols

- **[HTTP](./http.md)** - For native HTTP-based tool implementations
- **[Server-Sent Events (SSE)](./sse.md)** - For real-time streaming tools
- **TCP/UDP** - For custom protocol implementations

For complete implementation details, see the [MCP Communication Protocol API Reference](../api/plugins/communication_protocols/mcp/src/utcp_mcp/mcp_communication_protocol.md).
