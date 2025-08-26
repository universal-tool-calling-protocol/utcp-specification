---
title: default_variable_substitutor
sidebar_label: default_variable_substitutor
---

# default_variable_substitutor

**File:** `core/src/utcp/implementations/default_variable_substitutor.py`

### class DefaultVariableSubstitutor ([VariableSubstitutor](./../interfaces/variable_substitutor.md#variablesubstitutor)) {#defaultvariablesubstitutor}

<details>
<summary>Documentation</summary>

Default implementation of variable substitution.

Provides a hierarchical variable resolution system that searches for

**Variables In The Following Order**

1. Configuration variables (exact match)
2. Custom variable loaders (in order)
3. Environment variables



**Features**

- Provider-specific variable namespacing
- Hierarchical variable resolution
- Recursive substitution in nested data structures
- Variable discovery for validation



**Variable Namespacing**

Provider-specific variables are prefixed with the provider name
to avoid conflicts. For example, a variable 'api_key' for provider
'web_scraper' becomes 'web__scraper_api_key' internally.
</details>

#### Methods:

<details>
<summary>substitute(self, obj: dict | list | str, config: [UtcpClientConfig](./../data/utcp_client_config.md#utcpclientconfig), variable_namespace: Optional[str]) -> Any</summary>

Recursively substitute variables in nested data structures.

Performs deep substitution on dictionaries, lists, and strings.
Non-string types are returned unchanged. String values are scanned
for variable references using $\{VAR\} and $VAR syntax.


**Args**

- **`obj`**: Object to perform substitution on. Can be any type.
- **`config`**: UTCP client configuration containing variable sources.
- **`variable_namespace`**: Optional variable namespace.



**Returns**

Object with all variable references replaced. Structure and
non-string values are preserved.



**Raises**

- **`[UtcpVariableNotFound](./../exceptions/utcp_variable_not_found_exception.md#utcpvariablenotfound)`**: If any referenced variable cannot be resolved.
- **`ValueError`**: If variable_namespace contains invalid characters.



**Example**

```python
    substitutor = DefaultVariableSubstitutor()
    result = substitutor.substitute(
        {"url": "https://${HOST}/api", "port": 8080},
        config,
        "my_provider"
    )
    # Returns: {"url": "https://api.example.com/api", "port": 8080}
```
</details>

<details>
<summary>find_required_variables(self, obj: dict | list | str, variable_namespace: Optional[str]) -> List[str]</summary>

Recursively discover all variable references in a data structure.

Scans the object for variable references using $\{VAR\} and $VAR syntax,
returning fully-qualified variable names with variable namespacing.
Useful for validation and dependency analysis.


**Args**

- **`obj`**: Object to scan for variable references.
- **`variable_namespace`**: Variable namespace used for variable namespacing.
  Variable names are prefixed with this variable namespace.



**Raises**

- **`ValueError`**: If variable_namespace contains invalid characters.



**Returns**

List of fully-qualified variable names found in the object.



**Example**

```python
    substitutor = DefaultVariableSubstitutor()
    vars = substitutor.find_required_variables(
        {"url": "https://${HOST}/api", "key": "$API_KEY"},
        "web_api"
    )
    # Returns: ["web__api_HOST", "web__api_API_KEY"]
```
</details>

---
