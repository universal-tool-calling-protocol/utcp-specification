---
id: cli
title: CLI Protocol
sidebar_position: 4
---

# CLI Protocol

The CLI protocol plugin (`utcp-cli`) enables UTCP to execute multi-command workflows and scripts. This protocol supports sequential command execution with state preservation and cross-platform compatibility.

## Installation

```bash
# Example installation (Python)
pip install utcp-cli

# Example installation (Node.js)
npm install @utcp/cli
```

## Key Features

- **Multi-Command Execution**: Execute multiple commands sequentially in a single subprocess
- **State Preservation**: Directory changes and environment persist between commands
- **Cross-Platform Script Generation**: PowerShell on Windows, Bash on Unix/Linux/macOS
- **Flexible Output Control**: Choose which command outputs to include in final result
- **Argument Substitution**: `UTCP_ARG_argname_UTCP_END` placeholder system
- **Output Referencing**: Access previous command outputs with `$CMD_0_OUTPUT`, `$CMD_1_OUTPUT`
- **Environment Variables**: Secure credential and configuration passing

## Call Template Structure

```json
{
  "call_template_type": "cli",
  "commands": [
    {
      "command": "cd UTCP_ARG_target_dir_UTCP_END",
      "append_to_final_output": false
    },
    {
      "command": "git status --porcelain",
      "append_to_final_output": false
    },
    {
      "command": "echo \"Status: $CMD_1_OUTPUT, Files: $(echo \"$CMD_1_OUTPUT\" | wc -l)\"",
      "append_to_final_output": true
    }
  ],
  "working_dir": "/tmp",
  "env_vars": {
    "GIT_AUTHOR_NAME": "UTCP Bot"
  }
}
```

## Configuration Options

### Required Fields

- **`call_template_type`**: Must be `"cli"`
- **`commands`**: Array of `CommandStep` objects defining the sequence of commands

### Optional Fields

- **`working_dir`**: Working directory for command execution
- **`env_vars`**: Environment variables to set for all commands

### CommandStep Object

- **`command`**: Command string with `UTCP_ARG_argname_UTCP_END` placeholders
- **`append_to_final_output`**: Whether to include this command's output in the final result (defaults to `false` for all except the last command)

For complete field specifications and validation rules, see the [CLI Call Template API Reference](../api/plugins/communication_protocols/cli/src/utcp_cli/cli_call_template.md).

## Argument Substitution

Use `UTCP_ARG_argname_UTCP_END` placeholders in command strings:

```json
{
  "command": "git clone UTCP_ARG_repo_url_UTCP_END UTCP_ARG_target_dir_UTCP_END"
}
```

## Output Referencing

Reference previous command outputs using `$CMD_N_OUTPUT` variables:

```json
{
  "commands": [
    {
      "command": "git status --porcelain",
      "append_to_final_output": false
    },
    {
      "command": "echo \"Changes detected: $CMD_0_OUTPUT\"",
      "append_to_final_output": true
    }
  ]
}
```

## Security Considerations

:::danger Security Warning
CLI protocol executes commands on the local system. Always validate inputs and use with caution.
:::

### Input Validation

Always validate and sanitize inputs to prevent command injection:

```json
{
  "name": "safe_file_read",
  "description": "Safely read a file",
  "inputs": {
    "type": "object",
    "properties": {
      "filename": {
        "type": "string",
        "pattern": "^[a-zA-Z0-9._-]+$"
      }
    },
    "required": ["filename"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "commands": [
      {
        "command": "cd /safe/directory",
        "append_to_final_output": false
      },
      {
        "command": "cat UTCP_ARG_filename_UTCP_END",
        "append_to_final_output": true
      }
    ],
    "working_dir": "/safe/directory"
  }
}
```

### Sandboxing

Consider running CLI tools in sandboxed environments:

```json
{
  "call_template_type": "cli",
  "commands": [
    {
      "command": "docker run --rm --read-only -v /safe/data:/data:ro alpine:latest cat /data/UTCP_ARG_filename_UTCP_END",
      "append_to_final_output": true
    }
  ]
}
```

## Examples

### Simple Command Execution

```json
{
  "name": "get_system_info",
  "description": "Get system information",
  "inputs": {
    "type": "object",
    "properties": {}
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "commands": [
      {
        "command": "uname -a",
        "append_to_final_output": true
      }
    ]
  }
}
```

### Multi-Step File Analysis

```json
{
  "name": "analyze_directory",
  "description": "Analyze files in a directory",
  "inputs": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Directory path to analyze"
      }
    },
    "required": ["path"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "commands": [
      {
        "command": "cd UTCP_ARG_path_UTCP_END",
        "append_to_final_output": false
      },
      {
        "command": "find . -type f | wc -l",
        "append_to_final_output": false
      },
      {
        "command": "du -sh .",
        "append_to_final_output": false
      },
      {
        "command": "echo \"Directory Analysis: $CMD_2_OUTPUT total size, $CMD_1_OUTPUT files\"",
        "append_to_final_output": true
      }
    ]
  }
}
```

### Git Workflow

```json
{
  "name": "git_analysis",
  "description": "Analyze git repository",
  "inputs": {
    "type": "object",
    "properties": {
      "repo_url": {"type": "string"},
      "target_dir": {"type": "string"}
    },
    "required": ["repo_url", "target_dir"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "commands": [
      {
        "command": "git clone UTCP_ARG_repo_url_UTCP_END UTCP_ARG_target_dir_UTCP_END",
        "append_to_final_output": false
      },
      {
        "command": "cd UTCP_ARG_target_dir_UTCP_END",
        "append_to_final_output": false
      },
      {
        "command": "git log --oneline -10",
        "append_to_final_output": true
      },
      {
        "command": "find . -name '*.py' | wc -l",
        "append_to_final_output": false
      },
      {
        "command": "echo \"Repository has $CMD_3_OUTPUT Python files\"",
        "append_to_final_output": true
      }
    ],
    "env_vars": {
      "GIT_AUTHOR_NAME": "UTCP Bot",
      "GIT_AUTHOR_EMAIL": "bot@utcp.dev"
    }
  }
}
```

### Python Development Pipeline

```json
{
  "name": "python_pipeline",
  "description": "Run Python development pipeline",
  "inputs": {
    "type": "object",
    "properties": {
      "project_dir": {"type": "string"},
      "script_name": {"type": "string"}
    },
    "required": ["project_dir", "script_name"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "commands": [
      {
        "command": "cd UTCP_ARG_project_dir_UTCP_END",
        "append_to_final_output": false
      },
      {
        "command": "python -m pip install -r requirements.txt",
        "append_to_final_output": false
      },
      {
        "command": "python UTCP_ARG_script_name_UTCP_END",
        "append_to_final_output": true
      }
    ],
    "working_dir": "/workspace",
    "env_vars": {
      "PYTHONPATH": "/workspace/lib",
      "VIRTUAL_ENV": "/workspace/venv"
    }
  }
}
```

## Output Handling

The CLI protocol executes all commands in a single subprocess and returns the combined output based on `append_to_final_output` settings:

- Commands with `append_to_final_output: true` contribute to the final result
- Commands with `append_to_final_output: false` are executed for side effects only
- If no `append_to_final_output` is specified, only the last command's output is returned
- JSON output is automatically parsed if detected

### Success Response

```json
"Directory Analysis: 2.1G total size, 1247 files"
```

### JSON Output Detection

If output starts with `{` or `[`, it's automatically parsed as JSON:

```json
{
  "files": 1247,
  "size": "2.1G",
  "analysis_time": "2023-12-01T10:30:00Z"
}
```

## Environment Variables

Set environment variables for all commands:

```json
{
  "call_template_type": "cli",
  "commands": [
    {
      "command": "node app.js",
      "append_to_final_output": true
    }
  ],
  "env_vars": {
    "NODE_ENV": "production",
    "API_KEY": "${API_KEY}",
    "PORT": "3000"
  }
}
```

## Working Directory

Specify the initial working directory:

```json
{
  "call_template_type": "cli",
  "commands": [
    {
      "command": "make build",
      "append_to_final_output": true
    }
  ],
  "working_dir": "/project/src"
}
```

## Cross-Platform Considerations

### Command Syntax

Commands should use appropriate syntax for the target platform:

**Windows (PowerShell):**
```json
{
  "commands": [
    {"command": "Get-ChildItem UTCP_ARG_path_UTCP_END"},
    {"command": "Set-Location UTCP_ARG_dir_UTCP_END"}
  ]
}
```

**Unix/Linux/macOS (Bash):**
```json
{
  "commands": [
    {"command": "ls -la UTCP_ARG_path_UTCP_END"},
    {"command": "cd UTCP_ARG_dir_UTCP_END"}
  ]
}
```

### Universal Commands

Some commands work across platforms:
```json
{
  "commands": [
    {"command": "git status"},
    {"command": "python --version"},
    {"command": "node -v"}
  ]
}
```

## Best Practices

1. **Validate Inputs**: Always validate and sanitize user inputs using JSON Schema patterns
2. **Use Absolute Paths**: Prefer absolute paths for commands and files when possible
3. **Control Output**: Use `append_to_final_output` to control which command outputs are returned
4. **Reference Previous Output**: Use `$CMD_N_OUTPUT` to reference previous command results
5. **Limit Permissions**: Run with minimal necessary permissions
6. **Sandbox Execution**: Use containers or chroot when possible
7. **Handle Cross-Platform**: Consider platform-specific command syntax
8. **Environment Variables**: Use `env_vars` for secure credential passing

## Common Use Cases

- **Multi-step Builds**: setup → compile → test → package
- **Git Workflows**: clone → analyze → commit → push  
- **Data Pipelines**: fetch → transform → validate → output
- **File Operations**: navigate → search → process → report
- **Development Tools**: install dependencies → run tests → generate docs
- **System Administration**: check status → backup → cleanup → verify

## Error Handling

| Error Type | Description | Handling |
|------------|-------------|---------|
| Missing Arguments | Required UTCP_ARG placeholder not provided | Validation error |
| Command Not Found | Command doesn't exist | Script execution error |
| Permission Denied | Insufficient permissions | Script execution error |
| Timeout | Script exceeded timeout | Async timeout error |
| Non-zero Exit | Script failed | Return stderr output |

## Testing CLI Tools

```python
import pytest
from utcp.utcp_client import UtcpClient

@pytest.mark.asyncio
async def test_multi_command_cli_tool():
    client = await UtcpClient.create(config={
        "manual_call_templates": [{
            "name": "test_cli",
            "call_template_type": "cli",
            "commands": [
                {
                    "command": "echo UTCP_ARG_message_UTCP_END",
                    "append_to_final_output": false
                },
                {
                    "command": "echo \"Previous: $CMD_0_OUTPUT\""
                }
            ]
        }]
    })
    
    result = await client.call_tool("test_cli.echo_chain", {"message": "hello"})
    assert "Previous: hello" in result
```
