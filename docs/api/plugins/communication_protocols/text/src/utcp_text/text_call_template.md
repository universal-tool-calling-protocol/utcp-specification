---
title: text_call_template
sidebar_label: text_call_template
---

# text_call_template

**File:** `plugins/communication_protocols/text/src/utcp_text/text_call_template.py`

### class TextCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#textcalltemplate}

<details>
<summary>Documentation</summary>

Call template for text file-based manuals and tools.

Reads UTCP manuals or tool definitions from local JSON/YAML files. Useful for
static tool configurations or environments where manuals are distributed as files.


**Attributes**

- **`call_template_type`**: Always "text" for text file call templates.
- **`file_path`**: Path to the file containing the UTCP manual or tool definitions.
- **`auth`**: Always None - text call templates don't support authentication.
</details>

#### Fields:

- call_template_type: Literal['text']
- file_path: str
- auth: None

---

### class TextCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[TextCallTemplate]) {#textcalltemplateserializer}

Call template for reading and processing text files from local or remote sources.

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
