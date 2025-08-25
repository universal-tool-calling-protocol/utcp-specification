---
title: streamable_http_communication_protocol
sidebar_label: streamable_http_communication_protocol
---

# streamable_http_communication_protocol

**File:** `plugins/communication_protocols/http/src/utcp_http/streamable_http_communication_protocol.py`

### class StreamableHttpCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#streamablehttpcommunicationprotocol}

<details>
<summary>Documentation</summary>

Streamable HTTP communication protocol implementation for UTCP client.

Handles HTTP streaming with chunked transfer encoding for real-time data.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a manual and its tools from a StreamableHttp provider.
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregister a StreamableHttp manual. This is a no-op for the stateless streamable HTTP protocol.
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Execute a tool call through StreamableHttp transport.
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Execute a tool call through StreamableHttp transport with streaming.
</details>

---
