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

  Placeholders are NOT inlined as text. Instead the protocol
  emits a context-aware shell variable reference (`"$VAR"` /
  `${VAR}` / `$env:VAR`) and ships the actual `tool_args`
  value to the subprocess via an environment variable, so the
  shell expands the value AFTER it has parsed the script.
  Attacker-controlled bytes therefore cannot inject commands
  or escape any quoting context.

  A placeholder always substitutes a **single logical value**
  (never a list of shell words) -- the substituted value
  cannot be reinterpreted as additional shell syntax. Several
  placeholders may appear within the same quoted region (e.g.
  ``"https://api/UTCP_ARG_id_UTCP_END/UTCP_ARG_action_UTCP_END"``)
  and they compose with the surrounding literal text into one
  shell argument. Tools that previously relied on a single
  placeholder splitting into multiple flags (e.g.
  ``UTCP_ARG_flags_UTCP_END`` -> ``--verbose --debug``) must
  now use one placeholder per intended flag.

  PowerShell limitation: a placeholder appearing inside a
  single-quoted PowerShell string (``'...'``) raises
  ``ValueError`` at script-build time -- PowerShell does not
  expand variables inside single quotes, and rewriting the
  surrounding token is too brittle. Use a double-quoted
  string (``"..."``) instead.
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

``UTCP_ARG_argname_UTCP_END`` placeholders are replaced with a
context-aware shell variable reference (``"$VAR"`` outside quotes,
``$\{VAR\}`` inside double quotes, an adjacent-quote concat trick
inside single-quoted bash). The actual ``tool_args`` value is
shipped to the subprocess via a fresh, per-invocation env var; the
shell expands it at runtime AFTER it has parsed the script, so
attacker-controlled bytes cannot inject commands or escape any
quoting context.

A placeholder always substitutes a single logical value (never a
list of shell words). Several placeholders may appear in one
quoted region and compose with the surrounding text into one
argument (e.g.
If a tool needs multiple separate flags, use one placeholder per
flag in bare position. PowerShell single-quoted strings cannot
expand variables, so a placeholder inside ``'...'`` on Windows
raises ``ValueError`` at script-build time; use a double-quoted
string instead. This change closes the command-injection vector
tracked as GHSA-33p6-5jxp-p3x4 (and its residual
double-quote-context bypass that the inline ``shlex.quote``
strategy in 1.1.2 left open).

The CLI subprocess no longer inherits the full host environment.


**Inheritance Is Controlled By `Inherit_Env_Vars`**

is passed through (e.g. `PATH`, `PATHEXT`, `SYSTEMROOT`, `HOME`,
`LANG`) so shells and binaries can be located normally.
inherited; only `env_vars` is propagated.
through. The default allowlist is NOT merged in, so callers that
still need `PATH` must list it explicitly.
`env_vars` is always applied on top and overrides any inherited
value. Values in `env_vars` may be plain strings or `$\{VARNAME\}`
style placeholders resolved by the UTCP client's variable
client's variable sources, not against the host shell — to forward
a host variable by name use `inherit_env_vars`). This closes the
secret-exfiltration vector tracked as GHSA-5v57-8rxj-3p2r.



**Attributes**

- **`call_template_type`**: The type of the call template. Must be "cli".
- **`commands`**: A list of CommandStep objects defining the commands to execute
  in order. Each command can contain UTCP_ARG_argname_UTCP_END placeholders
  that will be replaced with values from tool_args during execution.
  Placeholders are shell-quoted and therefore expand to exactly one
  shell token (see class docstring).
- **`env_vars`**: A dictionary of environment variables to set for the command's
  execution context. Values can be static strings or placeholders for
  variables from the UTCP client's variable substitutor. Always
  propagated; overrides anything inherited from the host.
- **`inherit_env_vars`**: Controls which host environment variables are
  passed through to the subprocess.
  - None (default): the built-in default allowlist
  (`PATH`, `HOME`, `LANG` on Unix; `PATH`, `PATHEXT`,
  `SYSTEMROOT`, `USERPROFILE`, etc. on Windows) is
  inherited so shells and binaries work without extra
  configuration.
  - []: strict mode — no host variables are inherited at
  all. Only `env_vars` reaches the subprocess.
  - ["FOO", "BAR"]: exactly those host variables are
  inherited. The default allowlist is replaced, not
  extended, so include `PATH` (and any other required
  shell vars) yourself if needed.
  Variables named here that are not set on the host are
  silently skipped. Use this to expose specific host secrets
  such as `OPENAI_API_KEY`, `AWS_PROFILE`, `PYTHONPATH`, or
  `NODE_PATH` without putting their values in the call
  template.
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



**Command With Environment Variables, Host Pass-Through, And Placeholders**

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
      },
      "inherit_env_vars": ["OPENAI_API_KEY", "AWS_PROFILE"]
    }
```



**Security Considerations**

- Commands are executed in a subprocess. Ensure that the commands
specified are from a trusted source.
- `tool_args` values are shell-quoted on substitution, but the
*command template itself* is not — never assemble it from
untrusted input.
- The host environment is restricted; secrets are not propagated
unless explicitly named in `env_vars` or `inherit_env_vars`.
- Commands should use the appropriate syntax for the target platform
(PowerShell on Windows, Bash on Unix).
- Previous command outputs are available as variables but should be
used carefully to avoid command injection.
</details>

#### Fields:

- call_template_type: Literal['cli']
- commands: List[CommandStep]
- env_vars: Optional[Dict[str, str]]
- inherit_env_vars: Optional[List[str]]
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
