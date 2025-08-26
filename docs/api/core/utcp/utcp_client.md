---
title: utcp_client
sidebar_label: utcp_client
---

# utcp_client

**File:** `core/src/utcp/utcp_client.py`

### class UtcpClient {#utcpclient}

*No class documentation available*

#### Methods:

<details>
<summary>async create(cls, root_dir: Optional[str], config: Optional[Union[str, Dict[str, Any], '[UtcpClientConfig](./data/utcp_client_config.md#utcpclientconfig)']]) -> 'UtcpClient'</summary>

Create a new instance of UtcpClient.


**Args**

- **`root_dir`**: The root directory for the client to resolve relative paths from. Defaults to the current working directory.
- **`config`**: The configuration for the client. Can be a path to a configuration file, a dictionary, or [UtcpClientConfig](./data/utcp_client_config.md#utcpclientconfig) object.
- **`tool_repository`**: The tool repository to use. Defaults to [InMemToolRepository](./implementations/in_mem_tool_repository.md#inmemtoolrepository).
- **`search_strategy`**: The tool search strategy to use. Defaults to TagSearchStrategy.



**Returns**

A new instance of UtcpClient.
</details>

<details>
<summary>async register_manual(self, manual_call_template: [CallTemplate](./data/call_template.md#calltemplate)) -> [RegisterManualResult](./data/register_manual_response.md#registermanualresult)</summary>

Register a tool [CallTemplate](./data/call_template.md#calltemplate) and its tools.


**Args**

- **`manual_call_template`**: The [CallTemplate](./data/call_template.md#calltemplate) to register.



**Returns**

A [RegisterManualResult](./data/register_manual_response.md#registermanualresult) object containing the registered [CallTemplate](./data/call_template.md#calltemplate) and its tools.
</details>

<details>
<summary>async register_manuals(self, manual_call_templates: List[[CallTemplate](./data/call_template.md#calltemplate)]) -> List[[RegisterManualResult](./data/register_manual_response.md#registermanualresult)]</summary>

Register multiple tool CallTemplates and their tools.


**Args**

- **`manual_call_templates`**: List of CallTemplates to register.



**Returns**

A list of [RegisterManualResult](./data/register_manual_response.md#registermanualresult) objects containing the registered CallTemplates and their tools. Order is not preserved.
</details>

<details>
<summary>async deregister_manual(self, manual_call_template_name: str) -> bool</summary>

Deregister a tool [CallTemplate](./data/call_template.md#calltemplate).


**Args**

- **`manual_call_template_name`**: The name of the [CallTemplate](./data/call_template.md#calltemplate) to deregister.



**Returns**

True if the [CallTemplate](./data/call_template.md#calltemplate) was deregistered, False otherwise.
</details>

<details>
<summary>async call_tool(self, tool_name: str, tool_args: Dict[str, Any]) -> Any</summary>

Call a tool.


**Args**

- **`tool_name`**: The name of the tool to call.
- **`tool_args`**: The arguments to pass to the tool.



**Returns**

The result of the tool call.
</details>

<details>
<summary>async call_tool_streaming(self, tool_name: str, tool_args: Dict[str, Any]) -> AsyncGenerator[Any, None]</summary>

Call a tool streamingly.


**Args**

- **`tool_name`**: The name of the tool to call.
- **`tool_args`**: The arguments to pass to the tool.



**Returns**

An async generator that yields the result of the tool call.
</details>

<details>
<summary>async search_tools(self, query: str, limit: int, any_of_tags_required: Optional[List[str]]) -> List[[Tool](./data/tool.md#tool)]</summary>

Search for tools relevant to the query.


**Args**

- **`query`**: The search query.
- **`limit`**: The maximum number of tools to return. 0 for no limit.
- **`any_of_tags_required`**: Optional list of tags where one of them must be present in the tool's tags



**Returns**

A list of tools that match the search query.
</details>

<details>
<summary>async get_required_variables_for_manual_and_tools(self, manual_call_template: [CallTemplate](./data/call_template.md#calltemplate)) -> List[str]</summary>

Get the required variables for a manual [CallTemplate](./data/call_template.md#calltemplate) and its tools.


**Args**

- **`manual_call_template`**: The manual [CallTemplate](./data/call_template.md#calltemplate).



**Returns**

A list of required variables for the manual [CallTemplate](./data/call_template.md#calltemplate) and its tools.
</details>

<details>
<summary>async get_required_variables_for_registered_tool(self, tool_name: str) -> List[str]</summary>

Get the required variables for a registered tool.


**Args**

- **`tool_name`**: The name of a registered tool.



**Returns**

A list of required variables for the tool.
</details>

---
