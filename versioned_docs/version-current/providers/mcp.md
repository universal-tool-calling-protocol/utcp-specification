---
sidebar_position: 1
---




---
sidebar_position: 1
---

# MCP Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The MCP (Model Context Protocol) provider enables UTCP to interoperate with services that implement the Model Context Protocol, allowing for compatibility with MCP ecosystems.

## Configuration

MCP providers are configured using the following JSON structure:

```json
{
  "name": "mcp_service",
  "provider_type": "mcp",
  "config": {
    "mcpServers": {
      "stdio_server": {
        "transport": "stdio",
        "command": "mcp-server",
        "args": ["--port", "8080"],
        "env": {
          "MCP_API_KEY": "$YOUR_API_KEY"
        }
      },
      "http_server": {
        "transport": "http",
        "url": "https://mcp.example.com/stream"
      }
    }
  },
  "auth": {
    "auth_type": "oauth2",
    "client_id": "$YOUR_CLIENT_ID",
    "client_secret": "$YOUR_CLIENT_SECRET",
    "token_url": "https://auth.example.com/token"
  }
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"mcp"` |
| `config` | Yes | MCP configuration object containing server definitions |
| `config.mcpServers` | Yes | Dictionary of MCP server configurations |
| `auth` | No | Authentication configuration. Must be of type `OAuth2Auth`. |

### MCP Server Configuration

Each MCP server entry in the `mcpServers` dictionary defines a connection to an MCP server and must specify its `transport` type, which can be `stdio` or `http`.

#### Stdio Transport

For servers connected via standard input/output.

| Field | Required | Description |
|-------|----------|-------------|
| `transport` | Yes | Must be `"stdio"`. |
| `command` | Yes | The command to launch the MCP server. |
| `args` | No | Command line arguments for the MCP server. |
| `env` | No | Environment variables for the MCP server. |

#### HTTP Transport

For servers connected via streamable HTTP.

| Field | Required | Description |
|-------|----------|-------------|
| `transport` | Yes | Must be `"http"`. |
| `url` | Yes | The URL of the MCP server's streaming endpoint. |

## Tool Discovery

For MCP providers, UTCP tools are discovered through the MCP server's own discovery mechanism and then mapped to UTCP tools.

## Interoperability

The MCP provider serves as a bridge between UTCP and MCP ecosystems, allowing:

1. UTCP clients to access tools from MCP servers
2. MCP clients to access tools from UTCP providers (through an MCP adapter)

## Making Tool Calls

When a tool associated with an MCP provider is called, the UTCP client will:

1. Translate the UTCP tool call into an MCP tool call format
2. Send the request to the appropriate MCP server
3. Wait for the MCP server's response
4. Translate the MCP response back into the UTCP format
5. Return the result according to the tool's output schema

## Examples

### AI Model Access

```json
{
  "name": "ai_models",
  "provider_type": "mcp",
  "config": {
    "mcpServers": {
      "llm": {
        "command": "mcp-llm-server",
        "args": ["--models", "all"],
        "env": {
          "MODEL_API_KEY": "$YOUR_MODEL_API_KEY"
        }
      }
    }
  }
}
```

Tool definition:
```json
{
  "name": "generate_text",
  "description": "Generate text from a prompt using an AI model",
  "inputs": {
    "type": "object",
    "properties": {
      "prompt": {
        "type": "string",
        "description": "The prompt to generate text from"
      },
      "model": {
        "type": "string",
        "description": "Model to use",
        "default": "default-model"
      },
      "max_tokens": {
        "type": "integer",
        "description": "Maximum tokens to generate",
        "default": 100
      }
    },
    "required": ["prompt"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "text": {
        "type": "string",
        "description": "Generated text"
      }
    }
  }
}
```

## Best Practices

1. **Version Compatibility**: Ensure compatibility between UTCP and MCP versions
2. **Configuration Management**: Properly manage MCP server configurations
3. **Error Translation**: Map MCP-specific errors to appropriate UTCP errors
4. **Security Considerations**: Handle authentication and credentials securely
5. **Resource Management**: Properly manage MCP server lifecycle if launched by the UTCP client

The MCP provider enables integration with existing MCP ecosystems, providing a path for migration and interoperability between the two protocols.
