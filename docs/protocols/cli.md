---
id: cli
title: CLI Protocol
sidebar_position: 4
---

# CLI Protocol

The CLI protocol plugin (`utcp-cli`) enables UTCP to execute command-line tools and scripts. This is particularly useful for wrapping existing CLI applications and making them available to AI agents.

## Installation

```bash
pip install utcp-cli
```

## Call Template Structure

```json
{
  "call_template_type": "cli",
  "command": "curl",
  "args": [
    "-X", "GET",
    "-H", "Authorization: Bearer ${API_TOKEN}",
    "https://api.example.com/data"
  ],
  "working_directory": "/tmp",
  "environment": {
    "API_TOKEN": "${API_TOKEN}"
  },
  "timeout": 30
}
```

## Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `call_template_type` | string | Must be `"cli"` |
| `command` | string | The command to execute |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `args` | array | Command arguments |
| `working_directory` | string | Working directory for command execution |
| `environment` | object | Environment variables |
| `timeout` | number | Execution timeout in seconds (default: 30) |
| `shell` | boolean | Whether to execute through shell (default: false) |
| `capture_output` | boolean | Whether to capture stdout/stderr (default: true) |

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
    "command": "cat",
    "args": ["${filename}"],
    "working_directory": "/safe/directory"
  }
}
```

### Sandboxing

Consider running CLI tools in sandboxed environments:

```json
{
  "call_template_type": "cli",
  "command": "docker",
  "args": [
    "run", "--rm", "--read-only",
    "-v", "/safe/data:/data:ro",
    "alpine:latest",
    "cat", "/data/${filename}"
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
    "command": "uname",
    "args": ["-a"]
  }
}
```

### File Operations

```json
{
  "name": "list_directory",
  "description": "List files in a directory",
  "inputs": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Directory path to list"
      }
    },
    "required": ["path"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "command": "ls",
    "args": ["-la", "${path}"],
    "timeout": 10
  }
}
```

### Script Execution

```json
{
  "name": "run_analysis",
  "description": "Run data analysis script",
  "inputs": {
    "type": "object",
    "properties": {
      "input_file": {"type": "string"},
      "output_format": {"type": "string", "enum": ["json", "csv"]}
    },
    "required": ["input_file"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "command": "python",
    "args": [
      "/scripts/analyze.py",
      "--input", "${input_file}",
      "--format", "${output_format}"
    ],
    "working_directory": "/workspace",
    "environment": {
      "PYTHONPATH": "/workspace/lib"
    },
    "timeout": 300
  }
}
```

### Git Operations

```json
{
  "name": "git_status",
  "description": "Get git repository status",
  "inputs": {
    "type": "object",
    "properties": {
      "repo_path": {"type": "string"}
    },
    "required": ["repo_path"]
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "command": "git",
    "args": ["status", "--porcelain"],
    "working_directory": "${repo_path}"
  }
}
```

## Output Handling

The CLI protocol captures and returns:

- **stdout**: Standard output as the primary result
- **stderr**: Standard error (included in error cases)
- **return_code**: Process exit code
- **execution_time**: Time taken to execute

### Success Response

```json
{
  "stdout": "file1.txt\nfile2.txt\n",
  "stderr": "",
  "return_code": 0,
  "execution_time": 0.123
}
```

### Error Response

```json
{
  "stdout": "",
  "stderr": "ls: cannot access '/invalid/path': No such file or directory\n",
  "return_code": 2,
  "execution_time": 0.045
}
```

## Environment Variables

Set environment variables for command execution:

```json
{
  "call_template_type": "cli",
  "command": "node",
  "args": ["app.js"],
  "environment": {
    "NODE_ENV": "production",
    "API_KEY": "${API_KEY}",
    "PORT": "3000"
  }
}
```

## Working Directory

Specify the working directory for command execution:

```json
{
  "call_template_type": "cli",
  "command": "make",
  "args": ["build"],
  "working_directory": "/project/src"
}
```

## Best Practices

1. **Validate Inputs**: Always validate and sanitize user inputs
2. **Use Absolute Paths**: Prefer absolute paths for commands and files
3. **Set Timeouts**: Configure appropriate timeouts to prevent hanging
4. **Limit Permissions**: Run with minimal necessary permissions
5. **Sandbox Execution**: Use containers or chroot when possible
6. **Log Execution**: Log all command executions for audit trails
7. **Handle Errors**: Properly handle and report command failures

## Common Use Cases

- **Development Tools**: Git, npm, pip, docker commands
- **System Administration**: File operations, process management
- **Data Processing**: Scripts for ETL, analysis, reporting
- **Build Systems**: Make, gradle, webpack execution
- **Testing**: Running test suites and validation scripts

## Error Handling

| Error Type | Description | Handling |
|------------|-------------|----------|
| Command Not Found | Command doesn't exist | Raise `CommandNotFoundError` |
| Permission Denied | Insufficient permissions | Raise `PermissionError` |
| Timeout | Command exceeded timeout | Raise `TimeoutError` |
| Non-zero Exit | Command failed | Include stderr in error |

## Platform Considerations

### Windows

```json
{
  "call_template_type": "cli",
  "command": "cmd",
  "args": ["/c", "dir", "${path}"],
  "shell": true
}
```

### Unix/Linux

```json
{
  "call_template_type": "cli",
  "command": "ls",
  "args": ["-la", "${path}"]
}
```

### Cross-platform

```json
{
  "call_template_type": "cli",
  "command": "python",
  "args": ["-c", "import os; print(os.listdir('${path}'))"]
}
```
