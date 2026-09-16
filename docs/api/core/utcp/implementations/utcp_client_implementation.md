---
title: utcp_client_implementation
sidebar_label: utcp_client_implementation
---

# utcp_client_implementation

**File:** `core/src/utcp/implementations/utcp_client_implementation.py`

### class UtcpClientImplementation ([UtcpClient](./../utcp_client.md#utcpclient)) {#utcpclientimplementation}

<details>
<summary>Documentation</summary>

Implementation of the `UtcpClient` interface.

This class provides a concrete implementation of the `UtcpClient` interface.
</details>

#### Methods:

<details>
<summary>async close(self) -> None</summary>

Close the protocol instances this client created and release their resources.

Only what this client created. A shared instance is in use by every
other client in the process — closing it here would clear their state
too (a credential cache, a decorator's registry), which is the
cross-client damage per-client instances exist to prevent. Shared
instances live as long as the process that registered them.


**Raises**

- **`UtcpProtocolCloseError`**: If one or more owned instances failed to close.
  Every instance is still asked to close first.
</details>

<details>
<summary>async create(cls, root_dir: Optional[str], config: Optional[Union[str, Dict[str, Any], [UtcpClientConfig](./../data/utcp_client_config.md#utcpclientconfig)]]) -> '[UtcpClient](./../utcp_client.md#utcpclient)'</summary>

Create a new `UtcpClient` instance.


**Args**

- **`root_dir`**: The root directory for the client.
- **`config`**: The configuration for the client.



**Returns**

A new `UtcpClient` instance.
</details>

<details>
<summary>async register_manual(self, manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> [RegisterManualResult](./../data/register_manual_response.md#registermanualresult)</summary>

Register a manual in the client.

Registers a manual and its tools with the client. During registration, tools are
filtered based on the manual's `allowed_communication_protocols` setting:

- If `allowed_communication_protocols` is set to a non-empty list, only tools using
protocols in that list are registered.
- If `allowed_communication_protocols` is None or empty, it defaults to only allowing
the manual's own `call_template_type`. This provides secure-by-default behavior.

Tools that don't match the allowed protocols are excluded from registration and a
warning is logged for each excluded tool.


**Args**

- **`manual_call_template`**: The `CallTemplate` instance representing the manual to register.



**Returns**

A `RegisterManualResult` instance containing the registered tools (filtered by
allowed protocols) and any errors encountered.



**Raises**

- **`ValueError`**: If manual name is already registered or communication protocol is not found.
</details>

<details>
<summary>async register_manuals(self, manual_call_templates: List[[CallTemplate](./../data/call_template.md#calltemplate)]) -> List[[RegisterManualResult](./../data/register_manual_response.md#registermanualresult)]</summary>

Register multiple manuals in the client.


**Args**

- **`manual_call_templates`**: A list of `CallTemplate` instances representing the manuals to register.



**Returns**

A list of `RegisterManualResult` instances representing the results of the registration.
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

Executes a registered tool with the provided arguments. Before execution, validates
that the tool's communication protocol is allowed by the parent manual's
`allowed_communication_protocols` setting:

- If `allowed_communication_protocols` is set to a non-empty list, the tool's protocol
must be in that list.
- If `allowed_communication_protocols` is None or empty, only tools using the manual's
own `call_template_type` are allowed.


**Args**

- **`tool_name`**: The fully qualified name of the tool (e.g., "manual_name.tool_name").
- **`tool_args`**: A dictionary of arguments to pass to the tool.



**Returns**

The result of the tool call, after any post-processing.



**Raises**

- **`ValueError`**: If the tool is not found or if the tool's communication protocol
  is not in the manual's allowed protocols.
</details>

<details>
<summary>async call_tool_streaming(self, tool_name: str, tool_args: Dict[str, Any]) -> AsyncGenerator[Any, None]</summary>

Call a tool in the client with streaming response.

Executes a registered tool with streaming output. Before execution, validates
that the tool's communication protocol is allowed by the parent manual's
`allowed_communication_protocols` setting:

- If `allowed_communication_protocols` is set to a non-empty list, the tool's protocol
must be in that list.
- If `allowed_communication_protocols` is None or empty, only tools using the manual's
own `call_template_type` are allowed.


**Args**

- **`tool_name`**: The fully qualified name of the tool (e.g., "manual_name.tool_name").
- **`tool_args`**: A dictionary of arguments to pass to the tool.



**Yields**

Chunks of the tool's streaming response, after any post-processing.



**Raises**

- **`ValueError`**: If the tool is not found or if the tool's communication protocol
  is not in the manual's allowed protocols.
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

- **`manual_call_template`**: The `CallTemplate` instance representing the manual.



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
