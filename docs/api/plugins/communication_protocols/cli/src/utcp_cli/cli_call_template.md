---
title: cli_call_template
sidebar_label: cli_call_template
---

# cli_call_template

**File:** `plugins/communication_protocols/cli/src/utcp_cli/cli_call_template.py`

### class CommandStep {#commandstep}

<details>
<summary>Documentation</summary>

Configuration for a single command step in a CLI execution flow.


**Attributes**

- **`command`**: The command string to execute. Can contain UTCP_ARG_argname_UTCP_END
  placeholders that will be replaced with values from tool_args. Can also
  reference previous command outputs using $CMD_0_OUTPUT, $CMD_1_OUTPUT, etc.
- **`append_to_final_output`**: Whether this command's output should be included
  in the final result. If not specified, defaults to False for all
  commands except the last one.



**Basic Command Step**

```json
    {
      "command": "git status",
      "append_to_final_output": true
    }
```



**Command With Argument Placeholders And Output Reference**

```json
    {
      "command": "echo "Cloning to: UTCP_ARG_target_dir_UTCP_END, previous status: $CMD_0_OUTPUT"",
      "append_to_final_output": true
    }
```
</details>

#### Fields:

- command: str
- append_to_final_output: Optional[bool]

---

### class CliCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#clicalltemplate}

<details>
<summary>Documentation</summary>

Call template configuration for Command Line Interface (CLI) tools.

This class defines the configuration for executing command-line tools and
programs as UTCP tool providers. Commands are executed in a single subprocess
to maintain state (like directory changes) between commands.




**You Can Reference The Output Of Previous Commands Using Variables**


- **`Example`**: `echo "Previous result: $CMD_0_OUTPUT"`



**Attributes**

- **`call_template_type`**: The type of the call template. Must be "cli".
- **`commands`**: A list of CommandStep objects defining the commands to execute
  in order. Each command can contain UTCP_ARG_argname_UTCP_END placeholders
  that will be replaced with values from tool_args during execution.
- **`env_vars`**: A dictionary of environment variables to set for the command's
  execution context. Values can be static strings or placeholders for
  variables from the UTCP client's variable substitutor.
- **`working_dir`**: The working directory from which to run the commands. If not
  provided, it defaults to the current process's working directory.
- **`auth`**: Authentication details. Not applicable to the CLI protocol, so it
  is always None.



**Cross-Platform Directory Operations**

```json
    {
      "name": "cross_platform_dir_tool",
      "call_template_type": "cli",
      "commands": [
        {
          "command": "cd UTCP_ARG_target_dir_UTCP_END",
          "append_to_final_output": false
        },
        {
          "command": "ls -la",
          "append_to_final_output": true
        }
      ]
    }
```



**Referencing Previous Command Output**

```json
    {
      "name": "reference_previous_output_tool",
      "call_template_type": "cli",
      "commands": [
        {
          "command": "git status --porcelain",
          "append_to_final_output": false
        },
        {
          "command": "echo "Found changes: $CMD_0_OUTPUT"",
          "append_to_final_output": true
        }
      ]
    }
```



**Command With Environment Variables And Placeholders**

```json
    {
      "name": "python_multi_step_tool",
      "call_template_type": "cli",
      "commands": [
        {
          "command": "python setup.py install",
          "append_to_final_output": false
        },
        {
          "command": "python script.py --input UTCP_ARG_input_file_UTCP_END --result "$CMD_0_OUTPUT""
        }
      ],
      "env_vars": {
        "PYTHONPATH": "/custom/path",
        "API_KEY": "${API_KEY_VAR}"
      }
    }
```



**Security Considerations**

- Commands are executed in a subprocess. Ensure that the commands
specified are from a trusted source.
- Avoid passing unsanitized user input directly into the command string.
Use tool argument validation where possible.
- All placeholders are replaced with string values from tool_args.
- Commands should use the appropriate syntax for the target platform
(PowerShell on Windows, Bash on Unix).
- Previous command outputs are available as variables but should be
used carefully to avoid command injection.
</details>

#### Fields:

- call_template_type: Literal['cli']
- commands: List[CommandStep]
- env_vars: Optional[Dict[str, str]]
- working_dir: Optional[str]
- auth: None

---

### class CliCallTemplateSerializer ([Serializer](./../../../../../core/utcp/interfaces/serializer.md#serializer)[CliCallTemplate]) {#clicalltemplateserializer}

*No class documentation available*

#### Methods:

<details>
<summary>to_dict(self, obj: CliCallTemplate) -> dict</summary>

Converts a `CliCallTemplate` instance to its dictionary representation.


**Args**

- **`obj`**: The `CliCallTemplate` instance to serialize.



**Returns**

A dictionary representing the `CliCallTemplate`.
</details>

<details>
<summary>validate_dict(self, obj: dict) -> CliCallTemplate</summary>

Validates a dictionary and constructs a `CliCallTemplate` instance.


**Args**

- **`obj`**: The dictionary to validate and deserialize.



**Returns**

A `CliCallTemplate` instance.



**Raises**

- **`[UtcpSerializerValidationError](./../../../../../core/utcp/exceptions/utcp_serializer_validation_error.md#utcpserializervalidationerror)`**: If the dictionary is not a valid
  representation of a `CliCallTemplate`.
</details>

---
