---
title: utcp_variable_not_found_exception
sidebar_label: utcp_variable_not_found_exception
---

# utcp_variable_not_found_exception

**File:** `core/src/utcp/exceptions/utcp_variable_not_found_exception.py`

### class UtcpVariableNotFound {#utcpvariablenotfound}

<details>
<summary>Documentation</summary>

Exception raised when a required variable cannot be found.

This exception is thrown during variable substitution when a referenced
variable cannot be resolved through any of the configured variable sources.
It provides information about which variable was missing to help with
debugging configuration issues.


**Attributes**

- **`variable_name`**: The name of the variable that could not be found.
</details>

#### Fields:

- variable_name: str

#### Methods:

<details>
<summary>__init__(self, variable_name: str)</summary>

Initialize the exception with the missing variable name.


**Args**

- **`variable_name`**: Name of the variable that could not be found.
</details>

---
