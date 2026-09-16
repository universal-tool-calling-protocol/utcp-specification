---
title: sse_communication_protocol
sidebar_label: sse_communication_protocol
---

# sse_communication_protocol

**File:** `plugins/communication_protocols/http/src/utcp_http/sse_communication_protocol.py`

### class SseCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#ssecommunicationprotocol}

*No class documentation available*

#### Fields:

- MAX_RECONNECT_ATTEMPTS: int
- MAX_RECONNECT_DELAY_MS: int
- HANDSHAKE_TIMEOUT_SECONDS: float
- MAX_EVENT_BUFFER_CHARS: int

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

*No method documentation available*
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

*No method documentation available*
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

*No method documentation available*
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

*No method documentation available*
</details>

---
