---
title: variable_substitutor
sidebar_label: variable_substitutor
---

# variable_substitutor

**File:** `core/src/utcp/interfaces/variable_substitutor.py`

### class VariableSubstitutor {#variablesubstitutor}

*No class documentation available*

#### Methods:

<details>
<summary>substitute(self, obj: dict | list | str, config: [UtcpClientConfig](./../data/utcp_client_config.md#utcpclientconfig), variable_namespace: Optional[str]) -> Any</summary>

Substitute variables in the given object.


**Args**

- **`obj`**: Object containing potential variable references to substitute.
- **`config`**: UTCP client configuration containing variable definitions
  and loaders.
- **`variable_namespace`**: Optional variable namespace.



**Returns**

Object with all variable references replaced by their values.



**Raises**

- **`[UtcpVariableNotFound](./../exceptions/utcp_variable_not_found_exception.md#utcpvariablenotfound)`**: If a referenced variable cannot be resolved.
</details>

<details>
<summary>find_required_variables(self, obj: dict | list | str, variable_namespace: Optional[str]) -> List[str]</summary>

Find all variable references in the given object.


**Args**

- **`obj`**: Object to scan for variable references.
- **`variable_namespace`**: Optional variable namespace.



**Returns**

List of fully-qualified variable names found in the object.
</details>

---
