---
title: tool_post_processor
sidebar_label: tool_post_processor
---

# tool_post_processor

**File:** `core/src/utcp/interfaces/tool_post_processor.py`

### class ToolPostProcessor {#toolpostprocessor}

<details>
<summary>Documentation</summary>

Abstract interface for tool post processors.

Defines the contract for tool post processors that process the result of a tool call.

**[Tool](./../data/tool.md#tool) Post Processors Are Responsible For**

- Processing the result of a tool call
- Returning the processed result
</details>

#### Fields:

- tool_post_processor_type: str

#### Methods:

<details>
<summary>post_process(self, caller: '[UtcpClient](./../utcp_client.md#utcpclient)', tool: [Tool](./../data/tool.md#tool), manual_call_template: '[CallTemplate](./../data/call_template.md#calltemplate)', result: Any) -> Any</summary>

Process the result of a tool call.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool`**: The tool that was called.
- **`manual_call_template`**: The call template of the manual that was called.
- **`result`**: The result of the tool call.



**Returns**

The processed result.
</details>

---

### class ToolPostProcessorConfigSerializer ([Serializer](./serializer.md#serializer)[ToolPostProcessor]) {#toolpostprocessorconfigserializer}

<details>
<summary>Documentation</summary>

[Serializer](./serializer.md#serializer) for tool post processors.

Defines the contract for serializers that convert tool post processors to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting tool post processors to dictionaries for storage or transmission
- Converting dictionaries back to tool post processors
- Ensuring data consistency during serialization and deserialization
</details>

#### Fields:

- tool_post_processor_implementations: Dict[str, [Serializer](./serializer.md#serializer)[ToolPostProcessor]]

#### Methods:

<details>
<summary>to_dict(self, obj: ToolPostProcessor) -> dict</summary>

Convert a tool post processor to a dictionary.


**Args**

- **`obj`**: The tool post processor to convert.



**Returns**

The dictionary converted from the tool post processor.
</details>

<details>
<summary>validate_dict(self, data: dict) -> ToolPostProcessor</summary>

Validate a dictionary and convert it to a tool post processor.


**Args**

- **`data`**: The dictionary to validate and convert.



**Returns**

The tool post processor converted from the dictionary.
</details>

---
