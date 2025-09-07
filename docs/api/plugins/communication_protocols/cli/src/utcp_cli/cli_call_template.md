---
title: cli_call_template
sidebar_label: cli_call_template
---

# cli_call_template

**File:** `plugins/communication_protocols/cli/src/utcp_cli/cli_call_template.py`

### class CliCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#clicalltemplate}

<details>
<summary>Documentation</summary>

Call template configuration for Command Line Interface (CLI) tools.

This class defines the configuration for executing command-line tools and
programs as UTCP tool providers. It supports environment variable injection,
custom working directories, and defines the command to be executed.


**Attributes**

- **`call_template_type`**: The type of the call template. Must be "cli".
- **`command_name`**: The command or path of the program to execute. It can
  contain placeholders for arguments that will be substituted at
  runtime (e.g., `${arg_name}`).
- **`env_vars`**: A dictionary of environment variables to set for the command's
  execution context. Values can be static strings or placeholders for
  variables from the UTCP client's variable substitutor.
- **`working_dir`**: The working directory from which to run the command. If not
  provided, it defaults to the current process's working directory.
- **`auth`**: Authentication details. Not applicable to the CLI protocol, so it
  is always None.



**Basic Cli Command**

```json
    {
      "name": "list_files_tool",
      "call_template_type": "cli",
      "command_name": "ls -la",
      "working_dir": "/tmp"
    }
```



**Command With Environment Variables And Argument Placeholders**

```json
    {
      "name": "python_script_tool",
      "call_template_type": "cli",
      "command_name": "python script.py --input ${input_file}",
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
</details>

#### Fields:

- call_template_type: Literal['cli']
- command_name: str
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
