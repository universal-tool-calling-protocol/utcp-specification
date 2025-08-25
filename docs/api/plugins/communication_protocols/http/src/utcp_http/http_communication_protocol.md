---
title: http_communication_protocol
sidebar_label: http_communication_protocol
---

# http_communication_protocol

**File:** `plugins/communication_protocols/http/src/utcp_http/http_communication_protocol.py`

### class HttpCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#httpcommunicationprotocol}

<details>
<summary>Documentation</summary>

HTTP communication protocol implementation for UTCP client.

Handles communication with HTTP-based tool providers, supporting various
authentication methods, URL path parameters, and automatic tool discovery.
Enforces security by requiring HTTPS or localhost connections.


**Features**

- RESTful API communication with configurable HTTP methods
- URL path parameter substitution from tool arguments
- [Tool](./../../../../../core/utcp/data/tool.md#tool) discovery from UTCP manuals, OpenAPI specs, and YAML
- Request body and header field mapping from tool arguments
- OAuth2 token caching and automatic refresh
- Security validation of connection URLs



**Attributes**

- **`_session`**: Optional aiohttp ClientSession for connection reuse.
- **`_oauth_tokens`**: Cache of OAuth2 tokens by client_id.
- **`_log`**: Logger function for debugging and error reporting.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a manual and its tools.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`manual_call_template`**: The call template of the manual to register.



**Returns**

[RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult) object containing the call template and manual.
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregister a manual and its tools.

Deregistering a manual is a no-op for the stateless HTTP communication protocol.
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Execute a tool call through this transport.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call (may include provider prefix).
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Returns**

The tool's response, with type depending on the tool's output schema.
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Execute a tool call through this transport streamingly.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call (may include provider prefix).
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Returns**

An async generator that yields the tool's response.
</details>

---
