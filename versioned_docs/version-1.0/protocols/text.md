---
id: text
title: Text Protocol
sidebar_position: 5
---

# Text Protocol

The Text protocol plugin (`utcp-text`) enables UTCP to read UTCP manuals and tool definitions from local JSON/YAML files. This protocol is designed for static tool configurations or environments where manuals are distributed as files.

## Installation

```bash
# Python installation
pip install utcp-text
```

## Call Template Structure

```json
{
  "call_template_type": "text",
  "file_path": "/path/to/manual.json"
}
```

## Configuration Options

The Text call template has a simple structure for reading UTCP manuals from files. For complete field specifications and validation rules, see the [Text Call Template API Reference](../api/plugins/communication_protocols/text/src/utcp_text/text_call_template.md).

### Required Fields

- **`call_template_type`**: Must be "text"
- **`file_path`**: Path to the file containing UTCP manual or tool definitions
- **`auth`**: Always `None` (text call templates don't support authentication)

## Supported File Types

### UTCP Manual Files

```json
{
  "call_template_type": "text",
  "file_path": "/path/to/utcp_manual.json"
}
```

### OpenAPI Specifications

The protocol automatically detects and converts OpenAPI specs to UTCP manuals:

```json
{
  "call_template_type": "text",
  "file_path": "/path/to/openapi.yaml"
}
```

### Path Resolution

Relative paths are resolved against the UTCP client's root directory:

```json
{
  "call_template_type": "text",
  "file_path": "manuals/my_tools.json"  // Resolved against client root_dir
}
```

## Usage Examples

### Manual Registration

#### UTCP Manual File

```json
{
  "name": "local_tools_manual",
  "call_template": {
    "call_template_type": "text",
    "file_path": "/path/to/my_tools.json"
  }
}
```

#### OpenAPI Specification

```json
{
  "name": "api_tools_manual",
  "call_template": {
    "call_template_type": "text",
    "file_path": "/path/to/openapi.yaml"
  }
}
```

### Tool Execution

When tools are called, the Text protocol returns the content of the configured file:

```json
{
  "name": "read_file",
  "description": "Read content from a file",
  "inputs": {
    "type": "object",
    "properties": {},
    "required": []
  },
  "tool_call_template": {
    "call_template_type": "text",
    "file_path": "/path/to/data.txt"
  }
}
```

## Protocol Behavior

### Manual Registration

When registering a manual with `register_manual()`, the protocol:

1. **Reads the file** from the specified `file_path`
2. **Detects file format** (JSON/YAML)
3. **Identifies content type**:
   - UTCP Manual: Validates and returns directly
   - OpenAPI Spec: Converts to UTCP manual using OpenApiConverter
4. **Returns result** with loaded tools

### Tool Execution

When calling a tool with `call_tool()`, the protocol:

1. **Reads file content** from the `file_path` in the tool's call template
2. **Returns raw content** as a string

### Streaming Support

The `call_tool_streaming()` method yields the entire file content as a single chunk.

## File Format Support

### JSON Files

```json
// /path/to/manual.json
{
  "version": "0.2.0",
  "tools": [
    {
      "name": "example_tool",
      "description": "An example tool",
      "inputs": {"type": "object", "properties": {}}
    }
  ]
}
```

### YAML Files

```yaml
# /path/to/manual.yaml
version: "0.2.0"
tools:
  - name: example_tool
    description: An example tool
    inputs:
      type: object
      properties: {}
```

## Error Handling

The Text protocol handles various error conditions:

| Error Type | Condition | Behavior |
|------------|-----------|----------|
| File Not Found | File doesn't exist | Returns `RegisterManualResult` with `success: false` |
| Parse Error | Invalid JSON/YAML | Returns error result with exception details |
| Validation Error | Invalid UTCP manual | Returns error result with validation details |
| Generic Error | Unexpected exceptions | Returns error result with traceback |

### Error Response Format

```json
{
  "manual_call_template": { /* original template */ },
  "manual": { "tools": [] },
  "success": false,
  "errors": ["Error details here..."]
}
```

## Security Considerations

- **Path Resolution**: Relative paths are resolved against the client's `root_dir`
- **Local Files Only**: Protocol only supports local file system access
- **No Authentication**: Text call templates don't support auth (always `None`)

## Best Practices

1. **Use Absolute Paths**: When possible, use absolute file paths for clarity
2. **Validate Files**: Ensure UTCP manual files are valid before registration
3. **Handle Errors**: Check `RegisterManualResult.success` before using tools
4. **Organize Manuals**: Keep manual files in a dedicated directory structure
5. **Version Control**: Include manual files in version control for consistency

## Common Use Cases

- **Static Tool Definitions**: Distributing tool configurations as files
- **Local Development**: Testing UTCP tools without external dependencies
- **Offline Environments**: Using tools in environments without network access
- **Configuration Management**: Reading tool definitions from config files
- **OpenAPI Integration**: Converting existing OpenAPI specs to UTCP tools

## API Reference

For detailed information about the implementation, see:
- [Text Call Template API](../api/plugins/communication_protocols/text/src/utcp_text/text_call_template.md)
- [Text Communication Protocol API](../api/plugins/communication_protocols/text/src/utcp_text/text_communication_protocol.md)
