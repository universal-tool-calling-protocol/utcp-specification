---
title: file_call_template
sidebar_label: file_call_template
---

# file_call_template

**File:** `plugins/communication_protocols/file/src/utcp_file/file_call_template.py`

### class FileCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#filecalltemplate}

<details>
<summary>Documentation</summary>

Call template for file-based manuals and tools.

Reads UTCP manuals or tool definitions from local JSON/YAML files. Useful for
static tool configurations or environments where manuals are distributed as files.
For direct text content, use the text protocol instead.


**Attributes**

- **`call_template_type`**: Always "file" for file call templates.
- **`file_path`**: Path to the file containing the UTCP manual or tool definitions.
- **`auth`**: Always None - file call templates don't support authentication for file access.
- **`auth_tools`**: Optional authentication to apply to generated tools from OpenAPI specs.
</details>

#### Fields:

- call_template_type: Literal['file']
- file_path: str
- auth: None
- auth_tools: Optional[[Auth](./../../../../../core/utcp/data/auth.md#auth)]

---

### class FileCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[FileCallTemplate]) {#filecalltemplateserializer}

*No class documentation available*

#### Methods:

<details>
<summary>to_dict(self, obj: FileCallTemplate) -> dict</summary>

*No method documentation available*
</details>

<details>
<summary>validate_dict(self, obj: dict) -> FileCallTemplate</summary>

*No method documentation available*
</details>

---
