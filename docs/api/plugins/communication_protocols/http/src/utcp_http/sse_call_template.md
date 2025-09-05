---
title: sse_call_template
sidebar_label: sse_call_template
---

# sse_call_template

**File:** `plugins/communication_protocols/http/src/utcp_http/sse_call_template.py`

### class SseCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#ssecalltemplate}

<details>
<summary>Documentation</summary>

Provider configuration for Server-Sent Events (SSE) tools.

Enables real-time streaming of events from server to client using the
Server-Sent Events protocol. Supports automatic reconnection and
event type filtering. All tool arguments not mapped to URL body, headers
or query pattern parameters are passed as query parameters using '?arg_name=\{arg_value\}'.


**Attributes**

- **`call_template_type`**: Always "sse" for SSE providers.
- **`url`**: The SSE endpoint URL to connect to.
- **`event_type`**: Optional filter for specific event types. If None, all events are received.
- **`reconnect`**: Whether to automatically reconnect on connection loss.
- **`retry_timeout`**: Timeout in milliseconds before attempting reconnection.
- **`auth`**: Optional authentication configuration.
- **`headers`**: Optional static headers for the initial connection.
- **`body_field`**: Optional tool argument name to map to request body during connection.
- **`header_fields`**: List of tool argument names to map to HTTP headers during connection.
</details>

#### Fields:

- call_template_type: Literal['sse']
- url: str
- event_type: Optional[str]
- reconnect: bool
- retry_timeout: int
- auth: Optional[[Auth](./../../../../../core/utcp/data/auth.md#auth)]
- headers: Optional[Dict[str, str]]
- body_field: Optional[str]
- header_fields: Optional[List[str]]

---

### class SSECallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[SseCallTemplate]) {#ssecalltemplateserializer}

Call template for Server-Sent Events (SSE) streaming connections.

#### Methods:

<details>
<summary>to_dict(self, obj: SseCallTemplate) -> dict</summary>

*No method documentation available*
</details>

<details>
<summary>validate_dict(self, obj: dict) -> SseCallTemplate</summary>

*No method documentation available*
</details>

---
