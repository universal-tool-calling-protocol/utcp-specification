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


**Attributes**

- **`call_template_type`**: Always "mcp" for MCP providers.
- **`config`**: Configuration object containing MCP server definitions.
  This follows the same format as the official MCP server configuration.
- **`auth`**: Optional OAuth2 authentication for HTTP-based MCP servers.
</details>

#### Fields:

- call_template_type: Literal['mcp']
- config: McpConfig
- auth: Optional[[OAuth2Auth](./../../../../../core/utcp/data/auth_implementations/oauth2_auth.md#oauth2auth)]

---

### class McpCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[McpCallTemplate]) {#mcpcalltemplateserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer) for McpCallTemplate.
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: McpCallTemplate) -> dict</summary>

Convert McpCallTemplate to dictionary.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> McpCallTemplate</summary>

Validate and convert dictionary to McpCallTemplate.
</details>

---
