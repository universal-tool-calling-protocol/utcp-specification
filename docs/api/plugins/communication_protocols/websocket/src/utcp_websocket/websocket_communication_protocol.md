---
title: websocket_communication_protocol
sidebar_label: websocket_communication_protocol
---

# websocket_communication_protocol

**File:** `plugins/communication_protocols/websocket/src/utcp_websocket/websocket_communication_protocol.py`

### class WebSocketCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#websocketcommunicationprotocol}

<details>
<summary>Documentation</summary>

WebSocket communication protocol implementation for UTCP client.

Handles real-time bidirectional communication with WebSocket-based tool providers,
supporting various authentication methods and message formats. Enforces security
by requiring WSS or localhost connections.


**Features**

- Real-time WebSocket communication with persistent connections
- [Tool](./../../../../../core/utcp/data/tool.md#tool) discovery via WebSocket handshake using UTCP messages
- Flexible message formats (JSON or text-based with templates)
- Connection pooling and automatic keep-alive
- OAuth2 token caching and automatic refresh
- Security validation of connection URLs



**Attributes**

- **`_connections`**: Active WebSocket connections by provider key.
- **`_sessions`**: aiohttp ClientSessions for connection management.
- **`_oauth_tokens`**: Cache of OAuth2 tokens by client_id.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a manual and its tools via WebSocket discovery.

Expects a [UtcpManual](./../../../../../core/utcp/data/utcp_manual.md#utcpmanual) response with tools.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`manual_call_template`**: The call template of the manual to register.



**Returns**

[RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult) object containing the call template and manual.
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregister a manual by closing its WebSocket connection.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`manual_call_template`**: The call template of the manual to deregister.
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Execute a tool call through WebSocket.


**Provides Maximum Flexibility To Support Any Websocket Response Format**

- If response_format is specified, parses accordingly
- Otherwise, returns the raw response (string or bytes)
- No enforced response structure - works with any WebSocket endpoint



**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call.
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Returns**

The tool's response (format depends on response_format setting).
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Execute a tool call through WebSocket with streaming responses.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call.
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Yields**

Streaming responses from the tool.
</details>

---
