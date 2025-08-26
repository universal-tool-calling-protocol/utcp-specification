---
title: cli_communication_protocol
sidebar_label: cli_communication_protocol
---

# cli_communication_protocol

**File:** `plugins/communication_protocols/cli/src/utcp_cli/cli_communication_protocol.py`

### class CliCommunicationProtocol ([CommunicationProtocol](./../../../../../core/utcp/interfaces/communication_protocol.md#communicationprotocol)) {#clicommunicationprotocol}

<details>
<summary>Documentation</summary>

Transport implementation for CLI-based tool providers.

Handles communication with command-line tools by executing processes
and managing their input/output. Supports both tool discovery and
execution phases with comprehensive error handling and timeout management.


**Features**

- Asynchronous subprocess execution with proper cleanup
- [Tool](./../../../../../core/utcp/data/tool.md#tool) discovery through startup commands returning UTCP manuals
- Flexible argument formatting for various CLI conventions
- Environment variable injection for authentication
- JSON output parsing with graceful fallback to text
- Cross-platform command parsing and execution
- Configurable working directories and timeouts
- Process lifecycle management with proper termination



**Architecture**

CLI tools are discovered by executing the provider's command_name
and parsing the output for UTCP manual JSON. [Tool](./../../../../../core/utcp/data/tool.md#tool) calls execute
the same command with formatted arguments and return processed output.



**Attributes**

- **`_log`**: Logger function for debugging and error reporting.
</details>

#### Methods:

<details>
<summary>async register_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> [RegisterManualResult](./../../../../../core/utcp/data/register_manual_response.md#registermanualresult)</summary>

*No method documentation available*
</details>

<details>
<summary>async deregister_manual(self, caller, manual_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> None</summary>

*No method documentation available*
</details>

<details>
<summary>async call_tool(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> Any</summary>

Call a CLI tool.

Executes the command specified by provider.command_name with the provided arguments.


**Args**

- **`caller`**: The UTCP client that is calling this method.
- **`tool_name`**: Name of the tool to call
- **`tool_args`**: Arguments for the tool call
- **`tool_call_template`**: The [CliCallTemplate](./cli_call_template.md#clicalltemplate) for the tool



**The Output From The Command Execution Based On Exit Code**




**Raises**

- **`ValueError`**: If provider is not a CliProvider or command_name is not set
</details>

<details>
<summary>async call_tool_streaming(self, caller, tool_name: str, tool_args: Dict[str, Any], tool_call_template: [CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) -> AsyncGenerator[Any, None]</summary>

*No method documentation available*
</details>

---
