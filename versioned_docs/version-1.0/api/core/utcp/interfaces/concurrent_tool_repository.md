---
title: concurrent_tool_repository
sidebar_label: concurrent_tool_repository
---

# concurrent_tool_repository

**File:** `core/src/utcp/interfaces/concurrent_tool_repository.py`

### class ConcurrentToolRepository {#concurrenttoolrepository}

<details>
<summary>Documentation</summary>

Abstract interface for tool and provider storage implementations.

Defines the contract for repositories that manage the lifecycle and storage

**Of Utcp Tools And Call Templates. Repositories Are Responsible For**

- Persisting provider configurations and their associated tools
- Providing efficient lookup and retrieval operations
- Managing relationships between call templates and tools
- Ensuring data consistency during operations
- Thread safety

The repository interface supports both individual and bulk operations,
allowing for flexible implementation strategies ranging from simple
in-memory storage to sophisticated database backends.



**Note**

All methods are async to support both synchronous and asynchronous
storage implementations.
</details>

#### Fields:

- tool_repository_type: str

#### Methods:

<details>
<summary>async save_manual(self, manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate), manual: [UtcpManual](./../data/utcp_manual.md#utcpmanual)) -> None</summary>

Save a manual and its tools in the repository.


**Args**

- **`manual_call_template`**: The call template associated with the manual to save.
- **`manual`**: The manual to save.
</details>

<details>
<summary>async remove_manual(self, manual_name: str) -> bool</summary>

Remove a manual and its tools from the repository.


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

Get a tool from the repository.


**Args**

- **`tool_name`**: The name of the tool to retrieve.



**Returns**

The tool if found, otherwise None.
</details>

<details>
<summary>async get_tools(self) -> List[[Tool](./../data/tool.md#tool)]</summary>

Get all tools from the repository.


**Returns**

A list of tools.
</details>

<details>
<summary>async get_tools_by_manual(self, manual_name: str) -> Optional[List[[Tool](./../data/tool.md#tool)]]</summary>

Get tools associated with a specific manual.


**Args**

- **`manual_name`**: The name of the manual.



**Returns**

A list of tools associated with the manual, or None if the manual is not found.
</details>

<details>
<summary>async get_manual(self, manual_name: str) -> Optional[[UtcpManual](./../data/utcp_manual.md#utcpmanual)]</summary>

Get a manual from the repository.


**Args**

- **`manual_name`**: The name of the manual to retrieve.



**Returns**

The manual if found, otherwise None.
</details>

<details>
<summary>async get_manuals(self) -> List[[UtcpManual](./../data/utcp_manual.md#utcpmanual)]</summary>

Get all manuals from the repository.


**Returns**

A list of manuals.
</details>

<details>
<summary>async get_manual_call_template(self, manual_call_template_name: str) -> Optional[[CallTemplate](./../data/call_template.md#calltemplate)]</summary>

Get a manual call template from the repository.


**Args**

- **`manual_call_template_name`**: The name of the manual call template to retrieve.



**Returns**

The manual call template if found, otherwise None.
</details>

<details>
<summary>async get_manual_call_templates(self) -> List[[CallTemplate](./../data/call_template.md#calltemplate)]</summary>

Get all manual call templates from the repository.


**Returns**

A list of manual call templates.
</details>

---
