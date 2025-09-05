---
title: cli_call_template
sidebar_label: cli_call_template
---

# cli_call_template

**File:** `plugins/communication_protocols/cli/src/utcp_cli/cli_call_template.py`

### class CliCallTemplate ([CallTemplate](./../../../../../core/utcp/data/call_template.md#calltemplate)) {#clicalltemplate}

<details>
<summary>Documentation</summary>

Call template configuration for Command Line Interface tools.

Enables execution of command-line tools and programs as UTCP providers.
Supports environment variable injection and custom working directories.


**Attributes**

- **`call_template_type`**: Always "cli" for CLI providers.
- **`command_name`**: The name or path of the command to execute.
- **`env_vars`**: Optional environment variables to set during command execution.
- **`working_dir`**: Optional custom working directory for command execution.
- **`auth`**: Always None - CLI providers don't support authentication.
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

*No method documentation available*
</details>

<details>
<summary>validate_dict(self, obj: dict) -> CliCallTemplate</summary>

*No method documentation available*
</details>

---
