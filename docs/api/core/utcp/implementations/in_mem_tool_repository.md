---
title: in_mem_tool_repository
sidebar_label: in_mem_tool_repository
---

# in_mem_tool_repository

**File:** `core/src/utcp/implementations/in_mem_tool_repository.py`

### class InMemToolRepository ([ConcurrentToolRepository](./../interfaces/concurrent_tool_repository.md#concurrenttoolrepository)) {#inmemtoolrepository}

*No class documentation available*

#### Methods:

<details>
<summary>async save_manual(self, manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate), manual: [UtcpManual](./../data/utcp_manual.md#utcpmanual)) -> None</summary>

Save a manual and its associated tools.


**Args**

- **`manual_call_template`**: The manual call template to save.
- **`manual`**: The manual to save.
</details>

<details>
<summary>async remove_manual(self, manual_name: str) -> bool</summary>

Remove a manual and its associated tools.


**Args**

- **`manual_name`**: The name of the manual to remove.



**Returns**

True if the manual was removed, False otherwise.
</details>

<details>
<summary>async remove_tool(self, tool_name: str) -> bool</summary>

Remove a tool from the repository.


**Args**

- **`tool_name`**: The name of the tool to remove.



**Returns**

True if the tool was removed, False otherwise.
</details>

<details>
<summary>async get_tool(self, tool_name: str) -> Optional[[Tool](./../data/tool.md#tool)]</summary>

Get a tool by name.


**Args**

- **`tool_name`**: The name of the tool to get.



**Returns**

The tool if it exists, None otherwise.
</details>

<details>
<summary>async get_tools(self) -> List[[Tool](./../data/tool.md#tool)]</summary>

Get all tools in the repository.


**Returns**

A list of all tools in the repository.
</details>

<details>
<summary>async get_tools_by_manual(self, manual_name: str) -> Optional[List[[Tool](./../data/tool.md#tool)]]</summary>

Get all tools associated with a manual.


**Args**

- **`manual_name`**: The name of the manual to get tools for.



**Returns**

A list of tools associated with the manual, or None if the manual does not exist.
</details>

<details>
<summary>async get_manual(self, manual_name: str) -> Optional[[UtcpManual](./../data/utcp_manual.md#utcpmanual)]</summary>

Get a manual by name.


**Args**

- **`manual_name`**: The name of the manual to get.



**Returns**

The manual if it exists, None otherwise.
</details>

<details>
<summary>async get_manuals(self) -> List[[UtcpManual](./../data/utcp_manual.md#utcpmanual)]</summary>

Get all manuals in the repository.


**Returns**

A list of all manuals in the repository.
</details>

<details>
<summary>async get_manual_call_template(self, manual_call_template_name: str) -> Optional[[CallTemplate](./../data/call_template.md#calltemplate)]</summary>

Get a manual call template by name.


**Args**

- **`manual_call_template_name`**: The name of the manual call template to get.



**Returns**

The manual call template if it exists, None otherwise.
</details>

<details>
<summary>async get_manual_call_templates(self) -> List[[CallTemplate](./../data/call_template.md#calltemplate)]</summary>

Get all manual call templates in the repository.


**Returns**

A list of all manual call templates in the repository.
</details>

---

### class InMemToolRepositoryConfigSerializer ([Serializer](./../interfaces/serializer.md#serializer)[InMemToolRepository]) {#inmemtoolrepositoryconfigserializer}

*No class documentation available*

#### Methods:

<details>
<summary>to_dict(self, obj: InMemToolRepository) -> dict</summary>

Convert an `InMemToolRepository` instance to a dictionary.


**Args**

- **`obj`**: The `InMemToolRepository` instance to convert.



**Returns**

A dictionary representing the `InMemToolRepository` instance.
</details>

<details>
<summary>validate_dict(self, data: dict) -> InMemToolRepository</summary>

Convert a dictionary to an `InMemToolRepository` instance.


**Args**

- **`data`**: The dictionary to convert.



**Returns**

An `InMemToolRepository` instance representing the dictionary.
</details>

---
