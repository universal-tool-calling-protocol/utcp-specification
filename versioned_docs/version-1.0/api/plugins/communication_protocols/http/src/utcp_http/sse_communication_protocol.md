---
title: sse_communication_protocol
sidebar_label: sse_communication_protocol
---

# sse_communication_protocol

**File:** `plugins/communication_protocols/http/src/utcp_http/sse_communication_protocol.py`

### class SseCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#ssecommunicationprotocol}

<details>
<summary>Documentation</summary>

SSE communication protocol implementation for UTCP client.

Handles Server-Sent Events based tool providers with streaming capabilities.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Register a manual and its tools from an SSE provider.
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregister an SSE manual and close any active connections.
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Execute a tool call through SSE transport.
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Execute a tool call through SSE transport with streaming.
</details>

---
