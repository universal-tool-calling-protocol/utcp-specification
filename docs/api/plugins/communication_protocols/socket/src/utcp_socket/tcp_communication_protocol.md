---
title: tcp_communication_protocol
sidebar_label: tcp_communication_protocol
---

# tcp_communication_protocol

**File:** `plugins/communication_protocols/socket/src/utcp_socket/tcp_communication_protocol.py`

### class TCPTransport {#tcptransport}

*No class documentation available*

#### Methods:

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Streaming variant: the TCP protocol does not natively stream, so the full result is yielded as a single chunk.
</details>

---
