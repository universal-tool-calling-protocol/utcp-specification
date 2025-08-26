---
title: streamable_http_call_template
sidebar_label: streamable_http_call_template
---

# streamable_http_call_template

**File:** `plugins/communication_protocols/http/src/utcp_http/streamable_http_call_template.py`

### class StreamableHttpCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#streamablehttpcalltemplate}

<details>
<summary>Documentation</summary>

Provider configuration for HTTP streaming tools.

Uses HTTP Chunked Transfer Encoding to enable streaming of large responses
or real-time data. Useful for tools that return large datasets or provide
progressive results. All tool arguments not mapped to URL body, headers
or query pattern parameters are passed as query parameters using '?arg_name=\{arg_value\}'.


**Attributes**

- **`call_template_type`**: Always "streamable_http" for HTTP streaming providers.
- **`url`**: The streaming HTTP endpoint URL. Supports path parameters.
- **`http_method`**: The HTTP method to use (GET or POST).
- **`content_type`**: The Content-Type header for requests.
- **`chunk_size`**: Size of each chunk in bytes for reading the stream.
- **`timeout`**: Request timeout in milliseconds.
- **`headers`**: Optional static headers to include in requests.
- **`auth`**: Optional authentication configuration.
- **`body_field`**: Optional tool argument name to map to HTTP request body.
- **`header_fields`**: List of tool argument names to map to HTTP request headers.
</details>

#### Fields:

- call_template_type: Literal['streamable_http']
- url: str
- http_method: Literal['GET', 'POST']
- content_type: str
- chunk_size: int
- timeout: int
- headers: Optional[Dict[str, str]]
- auth: Optional[[Auth](./../../../../../core/utcp/data/auth.md#auth)]
- body_field: Optional[str]
- header_fields: Optional[List[str]]

---

### class StreamableHttpCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[StreamableHttpCallTemplate]) {#streamablehttpcalltemplateserializer}

*No class documentation available*

#### Methods:

<details>
<summary>to_dict(self, obj: StreamableHttpCallTemplate) -> dict</summary>

*No method documentation available*
</details>

<details>
<summary>validate_dict(self, obj: dict) -> StreamableHttpCallTemplate</summary>

*No method documentation available*
</details>

---
