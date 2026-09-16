---
title: file_communication_protocol
sidebar_label: file_communication_protocol
---

# file_communication_protocol

**File:** `plugins/communication_protocols/file/src/utcp_file/file_communication_protocol.py`

### class FileCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#filecommunicationprotocol}

<details>
<summary>Documentation</summary>

Communication protocol for file-based UTCP manuals and tools.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a file manual and return its tools as a [UtcpManual](./../../../../../core/utcp/data/utcp_manual.md#utcpmanual).
</details>

<details>
<summary>async deregister_manual(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregister a file manual (no-op).
</details>

<details>
<summary>async call_tool(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Call a tool: for file templates, return file content from the configured path.
</details>

<details>
<summary>async call_tool_streaming(self, caller: '[UtcpClient](./../../../../../core/utcp/utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Streaming variant: yields the full content as a single chunk.
</details>

---
