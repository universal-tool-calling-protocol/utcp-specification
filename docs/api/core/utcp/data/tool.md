---
title: tool
sidebar_label: tool
---

# tool

**File:** `core/src/utcp/data/tool.py`

### class JsonSchema {#jsonschema}

<details>
<summary>Documentation</summary>

JSON Schema for tool inputs and outputs.


**Attributes**

- **`schema_`**: Optional schema identifier.
- **`id_`**: Optional schema identifier.
- **`title`**: Optional schema title.
- **`description`**: Optional schema description.
- **`type`**: Optional schema type.
- **`properties`**: Optional schema properties.
- **`items`**: Optional schema items.
- **`required`**: Optional schema required fields.
- **`enum`**: Optional schema enum values.
- **`const`**: Optional schema constant value.
- **`default`**: Optional schema default value.
- **`format`**: Optional schema format.
- **`additionalProperties`**: Optional schema additional properties.
</details>

#### Fields:

- schema_: Optional[str]
- id_: Optional[str]
- title: Optional[str]
- description: Optional[str]
- type: Optional[Union[str, List[str]]]
- properties: Optional[Dict[str, 'JsonSchema']]
- items: Optional[Union['JsonSchema', List['JsonSchema']]]
- required: Optional[List[str]]
- enum: Optional[List[JsonType]]
- const: Optional[JsonType]
- default: Optional[JsonType]
- format: Optional[str]
- additionalProperties: Optional[Union[bool, 'JsonSchema']]
- pattern: Optional[str]
- minimum: Optional[float]
- maximum: Optional[float]
- minLength: Optional[int]
- maxLength: Optional[int]
- `model_config`

---

### class JsonSchemaSerializer ([Serializer](./../interfaces/serializer.md#serializer)[JsonSchema]) {#jsonschemaserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for JSON Schema.

Defines the contract for serializers that convert JSON Schema to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting JSON Schema to dictionaries for storage or transmission
- Converting dictionaries back to JSON Schema
- Ensuring data consistency during serialization and deserialization
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: JsonSchema) -> dict</summary>

Convert a JsonSchema object to a dictionary.


**Args**

- **`obj`**: The JsonSchema object to convert.



**Returns**

The dictionary converted from the JsonSchema object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> JsonSchema</summary>

Validate a dictionary and convert it to a JsonSchema object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The JsonSchema object converted from the dictionary.
</details>

---

### class Tool {#tool}

<details>
<summary>Documentation</summary>

Definition of a UTCP tool.

Represents a callable tool with its metadata, input/output schemas,
and provider configuration. Tools are the fundamental units of
functionality in the UTCP ecosystem.


**Attributes**

- **`name`**: Unique identifier for the tool, typically in format "provider.tool_name".
- **`description`**: Human-readable description of what the tool does.
- **`inputs`**: JSON Schema defining the tool's input parameters.
- **`outputs`**: JSON Schema defining the tool's return value structure.
- **`tags`**: List of tags for categorization and search.
- **`average_response_size`**: Optional hint about typical response size in bytes.
- **`tool_call_template`**: [CallTemplate](./call_template.md#calltemplate) configuration for accessing this tool.
</details>

#### Fields:

- name: str
- description: str
- inputs: JsonSchema
- outputs: JsonSchema
- tags: List[str]
- average_response_size: Optional[int]
- tool_call_template: [CallTemplate](./call_template.md#calltemplate)

---

### class ToolSerializer ([Serializer](./../interfaces/serializer.md#serializer)[Tool]) {#toolserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for tools.

Defines the contract for serializers that convert tools to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting tools to dictionaries for storage or transmission
- Converting dictionaries back to tools
- Ensuring data consistency during serialization and deserialization
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: Tool) -> dict</summary>

Convert a Tool object to a dictionary.


**Args**

- **`obj`**: The Tool object to convert.



**Returns**

The dictionary converted from the Tool object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> Tool</summary>

Validate a dictionary and convert it to a Tool object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The Tool object converted from the dictionary.
</details>

---
