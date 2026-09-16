---
title: cli_communication_protocol
sidebar_label: cli_communication_protocol
---

# cli_communication_protocol

**File:** `plugins/communication_protocols/cli/src/utcp_cli/cli_communication_protocol.py`

### class CliCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#clicommunicationprotocol}

*No class documentation available*

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

Registers a CLI-based manual and discovers its tools.

This method executes the command specified in the `[CliCallTemplate](./cli_call_template.md#clicalltemplate)`'s
`command_name` field. It then attempts to parse the command's output
(stdout) as a UTCP manual in JSON format.


**Args**

- **`caller`**: The UTCP client instance that is calling this method.
- **`manual_call_template`**: The `[CliCallTemplate](./cli_call_template.md#clicalltemplate)` containing the details for
  tool discovery, such as the command to run.



**Returns**

A `[RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)` object indicating whether the registration
was successful and containing the discovered tools.



**Raises**

- **`ValueError`**: If the `manual_call_template` is not an instance of
  `[CliCallTemplate](./cli_call_template.md#clicalltemplate)` or if `command_name` is not set.
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

Deregisters a CLI manual.

For the CLI protocol, this is a no-op as there are no persistent
connections to terminate.


**Args**

- **`caller`**: The UTCP client instance that is calling this method.
- **`manual_call_template`**: The call template of the manual to deregister.
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Calls a CLI tool by executing its command.

This method constructs and executes the command specified in the
`[CliCallTemplate](./cli_call_template.md#clicalltemplate)`. It formats the provided `tool_args` as command-line
arguments and runs the command in a subprocess.


**Args**

- **`caller`**: The UTCP client instance that is calling this method.
- **`tool_name`**: The name of the tool to call.
- **`tool_args`**: A dictionary of arguments for the tool call.
- **`tool_call_template`**: The `[CliCallTemplate](./cli_call_template.md#clicalltemplate)` for the tool.



**Returns**

The result of the command execution. If the command exits with a code
of 0, it returns the content of stdout. If the exit code is non-zero,
it returns the content of stderr.



**Raises**

- **`ValueError`**: If `tool_call_template` is not an instance of
  `[CliCallTemplate](./cli_call_template.md#clicalltemplate)` or if `command_name` is not set.
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

Execute a tool call through the CLI transport streamingly.

The CLI protocol does not natively support streaming, so the command is
executed to completion and the full result is yielded as a single chunk.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call.
- **`tool_args`**: Dictionary of arguments to pass to the tool.
- **`tool_call_template`**: Call template of the tool to call.



**Yields**

The complete tool result as a single item.
</details>

---
