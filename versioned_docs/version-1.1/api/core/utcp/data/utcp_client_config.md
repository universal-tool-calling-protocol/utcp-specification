---
title: utcp_client_config
sidebar_label: utcp_client_config
---

# utcp_client_config

**File:** `core/src/utcp/data/utcp_client_config.py`

### class UtcpClientConfig {#utcpclientconfig}

<details>
<summary>Documentation</summary>

Configuration model for UTCP client setup.

Provides comprehensive configuration options for UTCP clients including
variable definitions, provider file locations, and variable loading
mechanisms. Supports hierarchical variable resolution with multiple
sources.


**Variable Resolution Order**

1. Direct variables dictionary
2. Custom variable loaders (in order)
3. Environment variables



**Attributes**

variables for substitution.
variable loader configurations for loading variables from external
sources like .env files or remote services.
repository, which manages the storage and retrieval of tools.
Defaults to an in-memory repository.
search strategy, defining how tools are looked up. Defaults to a
tag and description-based search.
configurations to be applied after a tool call.
call templates for registering tools that don't have a provider.



**Example**

```python
    config = UtcpClientConfig(
        variables={"MANUAL__NAME_API_KEY_NAME": "$REMAPPED_API_KEY"},
        load_variables_from=[
            VariableLoaderSerializer().validate_dict({"variable_loader_type": "dotenv", "env_file_path": ".env"})
        ],
        tool_repository={
            "tool_repository_type": "in_memory"
        },
        tool_search_strategy={
            "tool_search_strategy_type": "tag_and_description_word_match"
        },
        post_processing=[],
        manual_call_templates=[]
    )
```
</details>

#### Fields:

- variables: Optional[Dict[str, str]]
- load_variables_from: Optional[List[[VariableLoader](./variable_loader.md#variableloader)]]
- tool_repository: [ConcurrentToolRepository](./../interfaces/concurrent_tool_repository.md#concurrenttoolrepository)
- tool_search_strategy: [ToolSearchStrategy](./../interfaces/tool_search_strategy.md#toolsearchstrategy)
- post_processing: List[[ToolPostProcessor](./../interfaces/tool_post_processor.md#toolpostprocessor)]
- manual_call_templates: List[[CallTemplate](./call_template.md#calltemplate)]

---

### class UtcpClientConfigSerializer ([Serializer](./../interfaces/serializer.md#serializer)[UtcpClientConfig]) {#utcpclientconfigserializer}

<details>
<summary>Documentation</summary>

[Serializer](./../interfaces/serializer.md#serializer) for UTCP client configurations.

Defines the contract for serializers that convert UTCP client configurations to and from

**Dictionaries For Storage Or Transmission. Serializers Are Responsible For**

- Converting UTCP client configurations to dictionaries for storage or transmission
- Converting dictionaries back to UTCP client configurations
- Ensuring data consistency during serialization and deserialization
</details>

#### Methods:

<details>
<summary>to_dict(self, obj: UtcpClientConfig) -> dict</summary>

Convert a UtcpClientConfig object to a dictionary.


**Args**

- **`obj`**: The UtcpClientConfig object to convert.



**Returns**

The dictionary converted from the UtcpClientConfig object.
</details>

<details>
<summary>validate_dict(self, data: dict) -> UtcpClientConfig</summary>

Validate a dictionary and convert it to a UtcpClientConfig object.


**Args**

- **`data`**: The dictionary to validate and convert.



**Returns**

The UtcpClientConfig object converted from the dictionary.
</details>

---
