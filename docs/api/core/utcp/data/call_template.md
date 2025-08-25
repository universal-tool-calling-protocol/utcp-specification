---
title: call_template
sidebar_label: call_template
---

# call_template

**File:** `core/src/utcp/data/call_template.py`

### class CallTemplate {#calltemplate}

<details>
<summary>Documentation</summary>

Base class for all UTCP tool providers.

This is the abstract base class that all specific call template implementations
inherit from. It provides the common fields that every provider must have.


**Attributes**

- **`name`**: Unique identifier for the provider. Defaults to a random UUID hex string.
  Should be unique across all providers and recommended to be set to a human-readable name.
  Can only contain letters, numbers and underscores. All special characters must be replaced with underscores.
- **`call_template_type`**: The transport protocol type used by this provider.
</details>

#### Fields:

- name: str
- call_template_type: str
- auth: Optional[[Auth](./auth.md#auth)]

---

### class CallTemplateSerializer ([Serializer](./../interfaces/serializer.md#serializer)[CallTemplate]) {#calltemplateserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for call templates.

Defines the contract for serializers that convert call templates to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting call templates to dictionaries for storage or transmission
- Converting dictionaries back to call templates
- Ensuring data consistency during serialization and deserialization
</details>

#### Fields:

- call_template_serializers: dict[str, [Serializer](./../interfaces/serializer.md#serializer)[CallTemplate]]

#### Methods:

<details>
<summary>to_dict(self, obj: CallTemplate) -> dict</summary>

Convert a CallTemplate object to a dictionary.


**Args**

- **`obj`**: The CallTemplate object to convert.



**Returns**

The dictionary converted from the CallTemplate object.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> CallTemplate</summary>

Validate a dictionary and convert it to a CallTemplate object.


**Args**

- **`obj`**: The dictionary to validate and convert.



**Returns**

The CallTemplate object converted from the dictionary.
</details>

---
