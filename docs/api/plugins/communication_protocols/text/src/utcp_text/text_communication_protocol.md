---
title: text_communication_protocol
sidebar_label: text_communication_protocol
---

# text_communication_protocol

**File:** `plugins/communication_protocols/text/src/utcp_text/text_communication_protocol.py`

### class TextCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#textcommunicationprotocol}

<details>
<summary>Documentation</summary>

Communication protocol for file-based UTCP manuals and tools.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a text manual and return its tools as a [UtcpManual](./../../../../../core/utcp/data/utcp_manual.md#utcpmanual).
</details>

<details>
<summary>async deregister_manual(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregister a text manual (no-op).
</details>

<details>
<summary>async call_tool(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Call a tool: for text templates, return file content from the configured path.
</details>

<details>
<summary>async call_tool_streaming(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Streaming variant: yields the full content as a single chunk.
</details>

---
