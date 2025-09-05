---
title: dot_env_variable_loader
sidebar_label: dot_env_variable_loader
---

# dot_env_variable_loader

**File:** `core/src/utcp/data/variable_loader_implementations/dot_env_variable_loader.py`

### class DotEnvVariableLoader ([VariableLoader](./../variable_loader.md#variableloader)) {#dotenvvariableloader}

<details>
<summary>Documentation</summary>

Environment file variable loader implementation.

Loads variables from .env files using the dotenv format. This loader
supports the standard key=value format with optional quoting and
comment support provided by the python-dotenv library.


**Attributes**

- **`env_file_path`**: Path to the .env file to load variables from.



**Example**

```python
    loader = DotEnvVariableLoader(env_file_path=".env")
    api_key = loader.get("API_KEY")
```
</details>

#### Fields:

- variable_loader_type: Literal['dotenv']
- env_file_path: str

#### Methods:

<details>
<summary>get(self, key: str) -> Optional[str]</summary>

Load a variable from the configured .env file.


**Args**

- **`key`**: Variable name to retrieve from the environment file.



**Returns**

Variable value if found in the file, None otherwise.
</details>

---

### class DotEnvVariableLoaderSerializer ([Serializer](./../../interfaces/serializer.md#serializer)[DotEnvVariableLoader]) {#dotenvvariableloaderserializer}

Variable loader implementation for reading variables from .env files.

#### Methods:

<details>
<summary>to_dict(self, obj: DotEnvVariableLoader) -> dict</summary>

Convert a DotEnvVariableLoader object to a dictionary.


**Args**

- **`obj`**: The DotEnvVariableLoader object to convert.



**Returns**

The dictionary converted from the DotEnvVariableLoader object.
</details>

<details>
<summary>validate_dict(self, data: dict) -> DotEnvVariableLoader</summary>

Validate a dictionary and convert it to a DotEnvVariableLoader object.


**Args**

- **`data`**: The dictionary to validate and convert.



**Returns**

The DotEnvVariableLoader object converted from the dictionary.
</details>

---
