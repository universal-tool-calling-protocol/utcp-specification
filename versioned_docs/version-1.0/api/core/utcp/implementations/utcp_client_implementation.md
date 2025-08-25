---
title: utcp_client_implementation
sidebar_label: utcp_client_implementation
---

# utcp_client_implementation

**File:** `core/src/utcp/implementations/utcp_client_implementation.py`

### class UtcpClientImplementation ([UtcpClient](./../utcp_client.md#utcpclient)) {#utcpclientimplementation}

<details>
<summary>Documentation</summary>

Implementation of the `[UtcpClient](./../utcp_client.md#utcpclient)` interface.

This class provides a concrete implementation of the `[UtcpClient](./../utcp_client.md#utcpclient)` interface.
</details>

#### Methods:

<details>
<summary>async create(cls, root_dir: Optional[str], config: Optional[Union[str, Dict[str, Any], [UtcpClientConfig](./../data/utcp_client_config.md#utcpclientconfig)]]) -> '[UtcpClient](./../utcp_client.md#utcpclient)'</summary>

Create a new `[UtcpClient](./../utcp_client.md#utcpclient)` instance.


**Args**

- **`root_dir`**: The root directory for the client.
- **`config`**: The configuration for the client.



**Returns**

A new `[UtcpClient](./../utcp_client.md#utcpclient)` instance.
</details>

<details>
<summary>async register_manual(self, manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> [RegisterManualResult](./../data/register_manual_response.md#registermanualresult)</summary>

Register a manual in the client.


**Args**

- **`manual_call_template`**: The `[CallTemplate](./../data/call_template.md#calltemplate)` instance representing the manual to register.



**Returns**

A `[RegisterManualResult](./../data/register_manual_response.md#registermanualresult)` instance representing the result of the registration.
</details>

<details>
<summary>async register_manuals(self, manual_call_templates: List[[CallTemplate](./../data/call_template.md#calltemplate)]) -> List[[RegisterManualResult](./../data/register_manual_response.md#registermanualresult)]</summary>

Register multiple manuals in the client.


**Args**

- **`manual_call_templates`**: A list of `[CallTemplate](./../data/call_template.md#calltemplate)` instances representing the manuals to register.



**Returns**

A list of `[RegisterManualResult](./../data/register_manual_response.md#registermanualresult)` instances representing the results of the registration.
</details>

<details>
<summary>async deregister_manual(self, manual_name: str) -> bool</summary>

Deregister a manual from the client.


**Args**

- **`manual_name`**: The name of the manual to deregister.



**Returns**

A boolean indicating whether the manual was successfully deregistered.
</details>

<details>
<summary>async call_tool(self, tool_name: str, tool_args: Dict[str, Any]) -> Any</summary>

Call a tool in the client.


**Args**

- **`tool_name`**: The name of the tool to call.
- **`tool_args`**: A dictionary of arguments to pass to the tool.



**Returns**

The result of the tool call.
</details>

<details>
<summary>async call_tool_streaming(self, tool_name: str, tool_args: Dict[str, Any]) -> AsyncGenerator[Any, None]</summary>

Call a tool in the client streamingly.


**Args**

- **`tool_name`**: The name of the tool to call.
- **`tool_args`**: A dictionary of arguments to pass to the tool.



**Returns**

An async generator yielding the result of the tool call.
</details>

<details>
<summary>async search_tools(self, query: str, limit: int, any_of_tags_required: Optional[List[str]]) -> List[[Tool](./../data/tool.md#tool)]</summary>

Search for tools based on the given query.


**Args**

- **`query`**: The query to search for.
- **`limit`**: The maximum number of results to return.
- **`any_of_tags_required`**: A list of tags that must be present in the tool.



**Returns**

A list of tools that match the query.
</details>

<details>
<summary>async get_required_variables_for_manual_and_tools(self, manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> List[str]</summary>

Get the required variables for a manual and its tools.


**Args**

- **`manual_call_template`**: The `[CallTemplate](./../data/call_template.md#calltemplate)` instance representing the manual.



**Returns**

A list of required variables for the manual and its tools.
</details>

<details>
<summary>async get_required_variables_for_registered_tool(self, tool_name: str) -> List[str]</summary>

Get the required variables for a registered tool.


**Args**

- **`tool_name`**: The name of the tool.



**Returns**

A list of required variables for the tool.
</details>

---
