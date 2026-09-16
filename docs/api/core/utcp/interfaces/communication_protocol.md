---
title: communication_protocol
sidebar_label: communication_protocol
---

# communication_protocol

**File:** `core/src/utcp/interfaces/communication_protocol.py`

### class CommunicationProtocol {#communicationprotocol}

<details>
<summary>Documentation</summary>

Abstract interface for UTCP client transport implementations.

Defines the contract that all transport implementations must follow to
integrate with the UTCP client. Each transport handles communication
with a specific type of provider (HTTP, CLI, WebSocket, etc.).

Transport implementations are responsible for:
- Discovering available tools from providers
- Managing provider lifecycle (registration/deregistration)
- Executing tool calls through the appropriate protocol

A protocol is registered in one of two registries, and the choice decides
who its state belongs to:

- `communication_protocols` holds an INSTANCE that is shared by every
`UtcpClient` in the process, and so is any state it keeps. That is the
right home for state that is meant to be shared (a credential cache, a
registry a decorator writes into). The instance
lives as long as the process that registered it; no client closes it.
- `communication_protocol_factories` holds a FACTORY, for a protocol whose
state must not be shared between clients: live sessions or connections
keyed per manual, child processes — anything one client's use or
`close()` would take away from another. Each `UtcpClient` calls it once
— at creation, or on first use for a factory registered later — so each
client gets its own instance, its own connections, and its own teardown
on `close()`. That is what makes a client per tenant, per user, or per
pooled connection actually isolate them, rather than every client
reaching into one shared instance.

A type registered as a factory wins over the same type registered as an
instance, so a plugin migrates by moving its registration from one
registry to the other and callers change nothing.
</details>

#### Fields:

- communication_protocols: dict[str, 'CommunicationProtocol']
- communication_protocol_factories: dict[str, Callable[[], 'CommunicationProtocol']]

#### Methods:

<details>
<summary>async register_manual(self, caller: '[UtcpClient](./../utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> [RegisterManualResult](./../data/register_manual_response.md#registermanualresult)</summary>

Register a manual and its tools.

Connects to the provider and retrieves the list of tools it offers.
This may involve making discovery requests, parsing configuration files,
or initializing connections depending on the provider type.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`manual_call_template`**: The call template of the manual to register.



**Returns**

[RegisterManualResult](./../data/register_manual_response.md#registermanualresult) object containing the call template and manual.



**Raises**

- **`ConnectionError`**: If unable to connect to the provider.
- **`ValueError`**: If the provider configuration is invalid.
</details>

<details>
<summary>async deregister_manual(self, caller: '[UtcpClient](./../utcp_client.md#utcpclient)', manual_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> None</summary>

Deregister a manual and its tools.

Cleanly disconnects from the provider and releases any associated
resources such as connections, processes, or file handles.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`manual_call_template`**: The call template of the manual to deregister.



**Note**

Should handle cases where the provider is already disconnected
or was never properly registered.
</details>

<details>
<summary>async call_tool(self, caller: '[UtcpClient](./../utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> Any</summary>

Execute a tool call through this transport.

Sends a tool invocation request to the provider using the appropriate
protocol and returns the result. Handles serialization of arguments
and deserialization of responses according to the transport type.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call (may include provider prefix).
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Returns**

The tool's response, with type depending on the tool's output schema.



**Raises**

- **`ToolNotFoundError`**: If the specified tool doesn't exist.
- **`ValidationError`**: If the arguments don't match the tool's input schema.
- **`ConnectionError`**: If unable to communicate with the provider.
- **`TimeoutError`**: If the tool call exceeds the configured timeout.
</details>

<details>
<summary>async call_tool_streaming(self, caller: '[UtcpClient](./../utcp_client.md#utcpclient)', tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Execute a tool call through this transport streamingly.

Sends a tool invocation request to the provider using the appropriate
protocol and returns the result. Handles serialization of arguments
and deserialization of responses according to the transport type.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call (may include provider prefix).
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Returns**

An async generator that yields the tool's response, with type depending on the tool's output schema.



**Raises**

- **`ToolNotFoundError`**: If the specified tool doesn't exist.
- **`ValidationError`**: If the arguments don't match the tool's input schema.
- **`ConnectionError`**: If unable to communicate with the provider.
- **`TimeoutError`**: If the tool call exceeds the configured timeout.
</details>

<details>
<summary>async close(self) -> None</summary>

Release every connection, session, process or other resource this
protocol instance holds.

`UtcpClient.close()` calls this on each instance the client created
from `communication_protocol_factories`, and `UtcpClient.create()`
calls it on those instances when initialization fails after they were
created. A shared instance from `communication_protocols` is never
closed on a client's behalf.

The default releases nothing, for protocols that hold nothing.
</details>

---
