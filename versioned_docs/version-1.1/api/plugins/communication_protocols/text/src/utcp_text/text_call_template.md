---
title: text_call_template
sidebar_label: text_call_template
---

# text_call_template

**File:** `plugins/communication_protocols/text/src/utcp_text/text_call_template.py`

### class TextCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#textcalltemplate}

<details>
<summary>Documentation</summary>

Text call template for UTCP client.

This template allows passing UTCP manuals or tool definitions directly as text content.
It supports both JSON and YAML formats and can convert OpenAPI specifications to UTCP manuals.
It's browser-compatible and requires no file system access.
For file-based manuals, use the file protocol instead.


**Attributes**

- **`call_template_type`**: Always "text" for text call templates.
- **`content`**: Direct text content of the UTCP manual or tool definitions (required).
- **`base_url`**: Optional base URL for API endpoints when converting OpenAPI specs.
- **`auth`**: Always None - text call templates don't support authentication.
- **`auth_tools`**: Optional authentication to apply to generated tools from OpenAPI specs.
</details>

#### Fields:

- call_template_type: Literal['text']
- content: str
- base_url: Optional[str]
- auth: None
- auth_tools: Optional[[Auth](./../../../../../core/utcp/data/auth.md#auth)]

---

### class TextCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[TextCallTemplate]) {#textcalltemplateserializer}

*No class documentation available*

#### Methods:

<details>
<summary>to_dict(self, obj: TextCallTemplate) -> dict</summary>

*No method documentation available*
</details>

<details>
<summary>validate_dict(self, obj: dict) -> TextCallTemplate</summary>

*No method documentation available*
</details>

---
