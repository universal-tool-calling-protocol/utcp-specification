---
title: mcp_call_template
sidebar_label: mcp_call_template
---

# mcp_call_template

**File:** `plugins/communication_protocols/mcp/src/utcp_mcp/mcp_call_template.py`

### class McpConfig {#mcpconfig}

<details>
<summary>Documentation</summary>

Implementing this class is not required!!!
The McpCallTemplate just needs to support a MCP compliant server configuration.

Configuration container for multiple MCP servers.

Holds a collection of named MCP server configurations, allowing
a single MCP provider to manage multiple server connections.


**Attributes**

- **`mcpServers`**: Dictionary mapping server names to their configurations.
</details>

#### Fields:

- mcpServers: Dict[str, Dict[str, Any]]

---

### class McpCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#mcpcalltemplate}

<details>
<summary>Documentation</summary>

Provider configuration for Model Context Protocol (MCP) tools.

Enables communication with MCP servers that provide structured tool
interfaces. Supports both stdio (local process) and HTTP (remote)
transport methods.


**Basic Mcp Server With Stdio Transport**

```json
    {
      "name": "mcp_server",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "filesystem": {
            "command": "node",
            "args": ["mcp-server.js"],
            "env": {"NODE_ENV": "production"}
          }
        }
      }
    }
```



**Mcp Server With Working Directory**

```json
    {
      "name": "mcp_tools",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "tools": {
            "command": "python",
            "args": ["-m", "mcp_server"],
            "cwd": "/app/mcp",
            "env": {
              "PYTHONPATH": "/app",
              "LOG_LEVEL": "INFO"
            }
          }
        }
      }
    }
```



**Mcp Server With Oauth2 Authentication**

```json
    {
      "name": "secure_mcp",
      "call_template_type": "mcp",
      "config": {
        "mcpServers": {
          "secure_server": {
            "transport": "http",
            "url": "https://mcp.example.com"
          }
        }
      },
      "auth": {
        "auth_type": "oauth2",
        "token_url": "https://auth.example.com/token",
        "client_id": "${CLIENT_ID}",
        "client_secret": "${CLIENT_SECRET}",
        "scope": "read:tools"
      }
    }
```



**During Migration (Utcp With Mcp)**

```python
    # UTCP Client with MCP plugin
    client = await UtcpClient.create()
    result = await client.call_tool("filesystem.read_file", {
        "path": "/data/file.txt"
    })
```



**After Migration (Pure Utcp)**

```python
    # UTCP Client with native protocol
    client = await UtcpClient.create()
    result = await client.call_tool("filesystem.read_file", {
        "path": "/data/file.txt"
    })
```



**Attributes**

- **`call_template_type`**: Always "mcp" for MCP providers.
- **`config`**: Configuration object containing MCP server definitions.
  This follows the same format as the official MCP server configuration.
- **`auth`**: Optional OAuth2 authentication for HTTP-based MCP servers.
- **`register_resources_as_tools`**: Whether to register MCP resources as callable tools.
  When True, server resources are exposed as tools that can be called.
  Default is False.
</details>

#### Fields:

- call_template_type: Literal['mcp']
- config: McpConfig
- auth: Optional[[OAuth2Auth](./../../../../../core/utcp/data/auth_implementations/oauth2_auth.md#oauth2auth)]
- register_resources_as_tools: bool

---

### class McpCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[McpCallTemplate]) {#mcpcalltemplateserializer}

*No class documentation available*

#### Methods:

<details>
<summary>to_dict(self, obj: McpCallTemplate) -> dict</summary>

*No method documentation available*
</details>

<details>
<summary>validate_dict(self, obj: dict) -> McpCallTemplate</summary>

*No method documentation available*
</details>

---
