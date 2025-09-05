---
id: text
title: Text Protocol
sidebar_position: 5
---

# Text Protocol

The Text protocol plugin (`utcp-text`) enables UTCP to read and process text files from local filesystem or remote URLs. This is useful for tools that need to access documentation, configuration files, logs, or any text-based data.

## Installation

```bash
# Example installation (Python)
pip install utcp-text

# Example installation (Node.js)
npm install @utcp/text
```

## Call Template Structure

```json
{
  "call_template_type": "text",
  "file_path": "/path/to/file.txt",
  "encoding": "utf-8",
  "max_size": 1048576,
  "line_range": {
    "start": 1,
    "end": 100
  }
}
```

## Configuration Options

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `call_template_type` | string | Must be `"text"` |
| `file_path` | string | Path to text file (local or URL) |

### Optional Fields

| Field | Type | Description |
|-------|------|-------------|
| `encoding` | string | File encoding (default: "utf-8") |
| `max_size` | number | Maximum file size in bytes (default: 1MB) |
| `line_range` | object | Specific line range to read |
| `pattern` | string | Regex pattern to filter content |
| `transform` | string | Content transformation ("upper", "lower", "strip") |

## File Sources

### Local Files

```json
{
  "call_template_type": "text",
  "file_path": "/var/log/application.log",
  "encoding": "utf-8"
}
```

### Remote URLs

```json
{
  "call_template_type": "text",
  "file_path": "https://example.com/config.txt",
  "max_size": 512000
}
```

### Variable Substitution

```json
{
  "call_template_type": "text",
  "file_path": "/data/${filename}",
  "encoding": "${file_encoding}"
}
```

## Examples

### Read Configuration File

```json
{
  "name": "read_config",
  "description": "Read application configuration file",
  "inputs": {
    "type": "object",
    "properties": {
      "config_name": {"type": "string"}
    },
    "required": ["config_name"]
  },
  "tool_call_template": {
    "call_template_type": "text",
    "file_path": "/etc/app/${config_name}.conf",
    "encoding": "utf-8",
    "max_size": 65536
  }
}
```

### Read Log File with Line Range

```json
{
  "name": "read_recent_logs",
  "description": "Read recent log entries",
  "inputs": {
    "type": "object",
    "properties": {
      "log_file": {"type": "string"},
      "lines": {"type": "number", "default": 100}
    },
    "required": ["log_file"]
  },
  "tool_call_template": {
    "call_template_type": "text",
    "file_path": "/var/log/${log_file}",
    "line_range": {
      "start": -${lines},
      "end": -1
    }
  }
}
```

### Read Remote Documentation

```json
{
  "name": "fetch_documentation",
  "description": "Fetch documentation from remote URL",
  "inputs": {
    "type": "object",
    "properties": {
      "doc_url": {"type": "string"},
      "section": {"type": "string"}
    },
    "required": ["doc_url"]
  },
  "tool_call_template": {
    "call_template_type": "text",
    "file_path": "${doc_url}",
    "pattern": "(?s)## ${section}.*?(?=## |$)",
    "max_size": 2097152
  }
}
```

### Search in File

```json
{
  "name": "search_in_file",
  "description": "Search for pattern in text file",
  "inputs": {
    "type": "object",
    "properties": {
      "file_path": {"type": "string"},
      "search_pattern": {"type": "string"}
    },
    "required": ["file_path", "search_pattern"]
  },
  "tool_call_template": {
    "call_template_type": "text",
    "file_path": "${file_path}",
    "pattern": "${search_pattern}",
    "transform": "strip"
  }
}
```

## Line Range Options

### Absolute Line Numbers

```json
{
  "line_range": {
    "start": 10,
    "end": 50
  }
}
```

### Relative to End (Tail)

```json
{
  "line_range": {
    "start": -100,
    "end": -1
  }
}
```

### From Start (Head)

```json
{
  "line_range": {
    "start": 1,
    "end": 100
  }
}
```

## Pattern Matching

### Simple Text Search

```json
{
  "pattern": "ERROR"
}
```

### Regex Pattern

```json
{
  "pattern": "\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2}:\\d{2} ERROR.*"
}
```

### Multi-line Pattern

```json
{
  "pattern": "(?s)START.*?END"
}
```

## Content Transformations

### Case Transformations

```json
{
  "transform": "upper"    // Convert to uppercase
}
```

```json
{
  "transform": "lower"    // Convert to lowercase
}
```

### Whitespace Handling

```json
{
  "transform": "strip"    // Remove leading/trailing whitespace
}
```

### Custom Transformations

```json
{
  "transform": "normalize_whitespace"  // Normalize all whitespace
}
```

## Response Format

### Successful Read

```json
{
  "content": "File content here...",
  "metadata": {
    "file_path": "/path/to/file.txt",
    "size": 1024,
    "lines": 25,
    "encoding": "utf-8",
    "last_modified": "2024-01-15T10:30:00Z"
  }
}
```

### Filtered Content

```json
{
  "content": "Matching lines...",
  "metadata": {
    "file_path": "/path/to/file.txt",
    "total_lines": 1000,
    "matched_lines": 5,
    "pattern": "ERROR",
    "line_range": {"start": 1, "end": 100}
  }
}
```

## Error Handling

| Error Type | Description | Handling |
|------------|-------------|----------|
| File Not Found | File doesn't exist | Raise `FileNotFoundError` |
| Permission Denied | No read permission | Raise `PermissionError` |
| File Too Large | Exceeds max_size limit | Raise `FileSizeError` |
| Encoding Error | Invalid file encoding | Raise `EncodingError` |
| Network Error | URL fetch failed | Raise `NetworkError` |

## Security Considerations

### Path Traversal Prevention

```json
{
  "call_template_type": "text",
  "file_path": "/safe/directory/${filename}",
  "allowed_paths": ["/safe/directory/"]
}
```

### File Size Limits

```json
{
  "max_size": 1048576  // 1MB limit
}
```

### URL Restrictions

```json
{
  "allowed_domains": ["example.com", "docs.company.com"]
}
```

## Best Practices

1. **Set Size Limits**: Always set appropriate max_size limits
2. **Validate Paths**: Validate file paths to prevent directory traversal
3. **Handle Encoding**: Specify encoding explicitly for non-UTF-8 files
4. **Use Line Ranges**: Use line ranges for large files to improve performance
5. **Pattern Efficiency**: Use efficient regex patterns for content filtering
6. **Cache Results**: Cache frequently accessed files
7. **Monitor Access**: Log file access for security auditing

## Advanced Features

### Conditional Reading

```json
{
  "call_template_type": "text",
  "file_path": "/var/log/app.log",
  "condition": {
    "modified_since": "2024-01-15T00:00:00Z"
  }
}
```

### Multi-file Reading

```json
{
  "call_template_type": "text",
  "file_paths": [
    "/etc/app/config1.txt",
    "/etc/app/config2.txt"
  ],
  "merge_strategy": "concatenate"
}
```

### Streaming Large Files

```json
{
  "call_template_type": "text",
  "file_path": "/var/log/huge.log",
  "streaming": true,
  "chunk_size": 8192
}
```

## Common Use Cases

- **Configuration Management**: Reading config files, environment files
- **Log Analysis**: Processing application logs, system logs
- **Documentation**: Accessing README files, API docs, manuals
- **Data Processing**: Reading CSV, JSON, XML text files
- **Template Processing**: Reading template files for generation
- **Code Analysis**: Reading source code files for analysis
- **Monitoring**: Reading status files, health check files

## Performance Considerations

| File Size | Recommended Approach |
|-----------|---------------------|
| < 1MB | Read entire file |
| 1MB - 10MB | Use line ranges |
| 10MB - 100MB | Use streaming |
| > 100MB | Use external tools |

## Integration Examples

### With HTTP Protocol

```json
{
  "name": "process_uploaded_file",
  "description": "Process uploaded text file",
  "inputs": {
    "type": "object",
    "properties": {
      "file_url": {"type": "string"}
    }
  },
  "tool_call_template": {
    "call_template_type": "text",
    "file_path": "${file_url}",
    "max_size": 5242880
  }
}
```

### With CLI Protocol

```json
{
  "name": "analyze_log_file",
  "description": "Analyze log file with external tool",
  "inputs": {
    "type": "object",
    "properties": {
      "log_path": {"type": "string"}
    }
  },
  "tool_call_template": {
    "call_template_type": "cli",
    "command": "log-analyzer",
    "args": ["--file", "${log_path}", "--format", "json"]
  }
}
```
