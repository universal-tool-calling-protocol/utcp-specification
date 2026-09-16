---
title: variable_loader
sidebar_label: variable_loader
---

# variable_loader

**File:** `core/src/utcp/data/variable_loader.py`

### class VariableLoader {#variableloader}

<details>
<summary>Documentation</summary>

Abstract base class for variable loading configurations.

Defines the interface for variable loaders that can retrieve variable
values from different sources such as files, databases, or external
services. Implementations provide specific loading mechanisms while
maintaining a consistent interface.


**Attributes**

- **`variable_loader_type`**: Type identifier for the variable loader.
</details>

#### Fields:

- variable_loader_type: str

#### Methods:

<details>
<summary>get(self, key: str) -> Optional[str]</summary>

Retrieve a variable value by key.


**Args**

- **`key`**: Variable name to retrieve.



**Returns**

Variable value if found, None otherwise.
</details>

---

### class VariableLoaderSerializer ([Serializer](./../interfaces/serializer.md#serializer)[VariableLoader]) {#variableloaderserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for VariableLoader model.
</details>

#### Fields:

- loader_serializers: Dict[str, Type[[Serializer](./../interfaces/serializer.md#serializer)[VariableLoader]]]

#### Methods:

<details>
<summary>to_dict(self, obj: VariableLoader) -> dict</summary>

Convert a VariableLoader object to a dictionary.


**Args**

- **`obj`**: The VariableLoader object to convert.



**Returns**

The dictionary converted from the VariableLoader object.
</details>

<details>
<summary>validate_dict(self, data: dict) -> VariableLoader</summary>

Validate a dictionary and convert it to a VariableLoader object.


**Args**

- **`data`**: The dictionary to validate and convert.



**Returns**

The VariableLoader object converted from the dictionary.
</details>

---
