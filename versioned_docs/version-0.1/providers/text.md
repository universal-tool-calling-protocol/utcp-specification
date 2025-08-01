---
id: text
title: Text Provider
sidebar_position: 12
---

# Text Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The Text provider enables UTCP to interact with tools defined in local text files, which is useful for file-based tools or for creating aggregated collections of tools from different providers.

## Configuration

Text providers are configured using the following JSON structure:

```json
{
  "name": "local_tools",
  "provider_type": "text",
  "file_path": "/path/to/tools.json"
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"text"` |
| `file_path` | Yes | Path to the file containing the tool definitions |

## Tool Discovery

For Text providers, tool discovery is straightforward - the tools are defined directly in the text file specified by `file_path`. This file should contain a JSON array of tool definitions or a UTCPManual object.

## Making Tool Calls

The Text provider can be used in two main ways:

1. **File-Based Tools**: The tool call is delegated to a process that writes results to a file which the provider then reads
2. **Tool Aggregation**: The provider acts as a collection point for tools from different providers

## Examples

### File-Based Tools

```json
{
  "name": "local_file_tools",
  "provider_type": "text",
  "file_path": "/etc/utcp/local_tools.json"
}
```

Example content of `local_tools.json`:
```json
{
  "version": "1.0",
  "tools": [
    {
      "name": "read_system_stats",
      "description": "Read system statistics",
      "inputs": {
        "type": "object",
        "properties": {
          "stat_type": {
            "type": "string",
            "enum": ["cpu", "memory", "disk"],
            "description": "Type of statistics to read"
          }
        },
        "required": ["stat_type"]
      },
      "outputs": {
        "type": "object",
        "properties": {
          "usage_percent": {
            "type": "number",
            "description": "Usage percentage"
          },
          "details": {
            "type": "object",
            "description": "Detailed statistics"
          }
        }
      },
      "provider": {
        "name": "system",
        "provider_type": "cli",
        "command_name": "system-stats"
      }
    }
  ]
}
```

### Tool Aggregation

```json
{
  "name": "tool_collection",
  "provider_type": "text",
  "file_path": "/etc/utcp/aggregated_tools.json"
}
```

Example content of `aggregated_tools.json`:
```json
{
  "version": "1.0",
  "tools": [
    {
      "name": "weather",
      "description": "Get weather information",
      "provider": {
        "name": "weather_api",
        "provider_type": "http",
        "url": "https://api.example.com/weather",
        "http_method": "GET"
      }
    },
    {
      "name": "translate",
      "description": "Translate text",
      "provider": {
        "name": "translation_api",
        "provider_type": "http",
        "url": "https://api.example.com/translate",
        "http_method": "POST"
      }
    },
    {
      "name": "notify",
      "description": "Send notifications",
      "provider": {
        "name": "notification_service",
        "provider_type": "websocket",
        "url": "wss://api.example.com/notifications"
      }
    }
  ]
}
```

## Best Practices

1. **File Permissions**: Ensure proper read permissions for the tool definition files
2. **File Watching**: Consider implementing file watching to detect changes to tool definitions
3. **Validation**: Validate tool definitions against the UTCP schema before using
4. **Path Resolution**: Implement proper path resolution, supporting both absolute and relative paths
5. **Error Handling**: Handle file access errors gracefully

The Text provider is particularly useful for development, testing, and for situations where tools need to be defined locally without requiring a server component.
