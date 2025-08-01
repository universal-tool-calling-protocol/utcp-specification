---
sidebar_position: 1
---




---
sidebar_position: 1
---

# CLI Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The CLI provider enables UTCP to interact with local command-line tools and utilities, allowing AI agents to leverage existing command-line interfaces without requiring API wrappers.

## Configuration

CLI providers are configured using the following JSON structure:

```json
{
  "name": "my_cli_tool",
  "provider_type": "cli",
  "command_name": "my-command",
  "working_dir": "/path/to/data",
  "env_vars": {
    "MY_VAR": "some_value"
  }
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|--------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"cli"` |
| `command_name` | Yes | Name of the CLI command to execute. |
| `working_dir` | No | The working directory from which to run the command. |
| `env_vars` | No | A dictionary of environment variables to set for the command's execution context. |

## Tool Discovery

CLI tools can expose their UTCP tool definitions in one of two ways:

1. **Discovery Flag**: The CLI tool accepts a special flag (e.g., `-utcp` or `--utcp-info`) that outputs the tool definitions in JSON format

```bash
$ my-command --utcp-info
{
  "version": "1.0",
  "tools": [
    {
      "name": "convert",
      "description": "Convert between file formats",
      "inputs": { ... },
      "outputs": { ... },
      "provider": { ... }
    }
  ]
}
```

2. **Static Definition**: The tool definitions are provided in a separate JSON file or in the provider configuration

```json
{
  "name": "my_cli_tool",
  "provider_type": "cli",
  "command_name": "my-command",
  "tools": [
    {
      "name": "convert",
      "description": "Convert between file formats",
      "inputs": { ... },
      "outputs": { ... }
    }
  ]
}
```

## Tool Calling

When a tool associated with a CLI provider is called, the UTCP client will:

1. Construct a command line from the provider configuration and tool parameters
2. Execute the command as a subprocess
3. Capture and parse the command's output according to the tool's output schema

### Parameter Passing

CLI tools can receive parameters in several ways, specified by the `param_style` field:

```json
{
  "name": "my_cli_tool",
  "provider_type": "cli",
  "command_name": "my-command",
  "param_style": "named"
}
```

Available parameter styles:

| Style | Description | Example |
|-------|-------------|---------|
| `named` | Parameters as named options (`--name value`) | `my-command --input file.txt --format json` |
| `positional` | Parameters as positional arguments | `my-command file.txt json` |
| `json` | Parameters as a JSON string in a single argument | `my-command '{"input": "file.txt", "format": "json"}'` |
| `json_stdin` | Parameters as JSON sent to the command's standard input | `echo '{"input": "file.txt"}' \| my-command` |

## Output Parsing

CLI tools can output results in various formats:

```json
{
  "name": "my_cli_tool",
  "provider_type": "cli",
  "command_name": "my-command",
  "output_format": "json"
}
```

Available output formats:

| Format | Description |
|--------|-------------|
| `json` | Command outputs JSON that can be directly parsed |
| `text` | Command outputs plain text that needs custom parsing |
| `csv` | Command outputs CSV data that will be parsed into an array |
| `xml` | Command outputs XML that will be parsed into a JSON structure |

## Examples

### Simple CLI Tool

```json
{
  "name": "file_converter",
  "provider_type": "cli",
  "command_name": "convert",
  "param_style": "named"
}
```

When calling a tool with this provider:
```bash
convert --input document.docx --output document.pdf --format pdf
```

### Advanced CLI Tool

```json
{
  "name": "data_processor",
  "provider_type": "cli",
  "command_name": "process-data",
  "param_style": "json_stdin",
  "output_format": "json",
  "working_dir": "/path/to/data",
  "env": {
    "PYTHONPATH": "/custom/python/path",
    "DEBUG": "1"
  }
}
```

## Security Considerations

:::warning

CLI providers execute commands on the local system, which presents significant security risks if not properly managed.

To mitigate these risks:

1. **Input Validation**: Strictly validate all parameters against the tool's input schema
2. **Path Traversal Protection**: Sanitize file paths to prevent directory traversal attacks
3. **Command Injection Prevention**: Escape or validate arguments to prevent injection attacks
4. **Permission Limitations**: Run commands with the minimum necessary permissions
5. **Resource Limits**: Implement timeouts and resource constraints

## Best Practices

1. **Structured Output**: Prefer CLI tools that output structured data (JSON, CSV, etc.)
2. **Error Handling**: Capture and parse stderr for error messages
3. **Logging**: Log command executions for audit and debugging purposes
4. **Async Execution**: For long-running commands, implement asynchronous execution
5. **Result Caching**: Cache results when appropriate to reduce command executions

The CLI provider bridges the gap between modern AI agents and traditional command-line utilities, enabling powerful integrations without requiring API development.
