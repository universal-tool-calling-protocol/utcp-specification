---
title: mcp_communication_protocol
sidebar_label: mcp_communication_protocol
---

# mcp_communication_protocol

**File:** `plugins/communication_protocols/mcp/src/utcp_mcp/mcp_communication_protocol.py`

### class McpCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#mcpcommunicationprotocol}

<details>
<summary>Documentation</summary>

MCP transport implementation that connects to MCP servers via stdio or HTTP.

This implementation uses a session-per-operation approach where each operation
(register, call_tool) opens a fresh session, performs the operation, and closes.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a manual with the communication protocol.
</details>

<details>
<summary>async call_tool(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Call a tool using the model context protocol.
</details>

<details>
<summary>async call_tool_streaming(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Streaming calls are not supported for MCP protocol, so we just call the tool and return the result as one item.
</details>

---
