---
title: websocket_call_template
sidebar_label: websocket_call_template
---

# websocket_call_template

**File:** `plugins/communication_protocols/websocket/src/utcp_websocket/websocket_call_template.py`

### class WebSocketCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#websocketcalltemplate}

<details>
<summary>Documentation</summary>

Call template configuration for WebSocket-based tools.

Supports real-time bidirectional communication via WebSocket protocol with
various message formats, authentication methods, and connection management features.


**Basic Websocket Connection**

```json
    {
      "name": "realtime_service",
      "call_template_type": "websocket",
      "url": "wss://api.example.com/ws"
    }
```



**With Authentication**

```json
    {
      "name": "secure_websocket",
      "call_template_type": "websocket",
      "url": "wss://api.example.com/ws",
      "auth": {
        "auth_type": "api_key",
        "api_key": "${WS_API_KEY}",
        "var_name": "Authorization",
        "location": "header"
      },
      "keep_alive": true,
      "protocol": "utcp-v1"
    }
```



**Custom Message Format**

```json
    {
      "name": "custom_format_ws",
      "call_template_type": "websocket",
      "url": "wss://api.example.com/ws",
      "request_data_format": "text",
      "request_data_template": "CMD:UTCP_ARG_command_UTCP_ARG;DATA:UTCP_ARG_data_UTCP_ARG",
      "timeout": 60
    }
```



**Attributes**

- **`call_template_type`**: Always "websocket" for WebSocket providers.
- **`url`**: WebSocket URL (must be wss:// or ws://localhost).
- **`message`**: Message template with UTCP_ARG_arg_name_UTCP_ARG placeholders for flexible formatting.
- **`protocol`**: Optional WebSocket subprotocol to use.
- **`keep_alive`**: Whether to maintain persistent connection with heartbeat.
- **`response_format`**: Expected response format ("json", "text", or "raw"). If None, returns raw response.
- **`timeout`**: Timeout in seconds for WebSocket operations.
- **`headers`**: Optional static headers to include in WebSocket handshake.
- **`header_fields`**: List of tool argument names to map to WebSocket handshake headers.
- **`auth`**: Optional authentication configuration for WebSocket connection.
</details>

#### Fields:

- call_template_type: Literal['websocket']
- url: str
- message: Optional[Union[str, Dict[str, Any]]]
- protocol: Optional[str]
- keep_alive: bool
- response_format: Optional[Literal['json', 'text', 'raw']]
- timeout: int
- headers: Optional[Dict[str, str]]
- header_fields: Optional[List[str]]

---

### class WebSocketCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[WebSocketCallTemplate]) {#websocketcalltemplateserializer}

*No class documentation available*

---
