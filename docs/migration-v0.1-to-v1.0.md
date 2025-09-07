---
id: migration-v0.1-to-v1.0
title: Migration Guide - v0.1 to v1.0
sidebar_position: 7
---

# Migration Guide: v0.1 to v1.0

This guide helps you migrate from UTCP v0.1 to v1.0, which introduces significant architectural improvements and new features.

## Overview of Changes

### Major Changes in v1.0

1. **Plugin Architecture**: Core functionality split into pluggable components
2. **Improved Data Models**: Enhanced Pydantic models with better validation
3. **New Protocol Support**: Additional communication protocols
4. **Better Error Handling**: More specific exception types
5. **Enhanced Authentication**: Expanded authentication options
6. **Performance Improvements**: Optimized client and protocol implementations

### Breaking Changes

| Component | v0.1 | v1.0 | Impact |
|-----------|------|------|--------|
| **Package Structure** | Single package | Core + plugins | High |
| **Client API** | `UtcpClient()` | `UtcpClient.create()` | Medium |
| **Configuration** | Simple dict | Structured config | Medium |
| **Protocol Registration** | Automatic | Plugin-based | High |
| **Error Types** | Generic exceptions | Specific exception types | Low |

## Installation Changes

### v0.1 Installation

```bash
pip install utcp
```

### v1.0 Installation

```bash
# Core package
pip install utcp

# Protocol plugins (install as needed)
pip install utcp-http utcp-cli utcp-websocket utcp-text utcp-mcp
```

## Client Migration

### v0.1 Client Code

**Legacy v0.1 client configuration:**
- Import UTCP client library
- Configure providers with provider-specific settings (name, type, URL, HTTP method)
- Call tools using provider.tool_name format
- Synchronous tool calling interface

### v1.0 Client Code

**New v1.0 client configuration:**
- Import updated UTCP client library from new module path
- Use async factory method for client creation
- Configure manual call templates instead of providers
- Use async/await pattern for tool calling
- Enhanced error handling and response processing

## Configuration Migration

### v0.1 Configuration

```yaml
providers:
  - name: weather_service
    provider_type: http
    url: https://weather.example.com/utcp
    http_method: GET
  - name: file_service
    provider_type: cli
    command: cat
    args: ["${filename}"]

variables:
  API_KEY: your_api_key
```

### v1.0 Configuration

```yaml
manual_call_templates:
  - name: weather_service
    call_template_type: http
    url: https://weather.example.com/utcp
    http_method: GET
  - name: file_service
    call_template_type: cli
    command: cat
    args: ["${filename}"]

load_variables_from:
  - variable_loader_type: dotenv
    env_file_path: .env
```

## Manual Format Migration

### v0.1 Manual Format

```json
{
  "utcp_version": "0.1.0",
  "provider_info": {
    "name": "weather_api",
    "version": "1.0.0"
  },
  "tools": [
    {
      "name": "get_weather",
      "description": "Get weather data",
      "parameters": {
        "type": "object",
        "properties": {
          "location": {"type": "string"}
        }
      },
      "provider": {
        "provider_type": "http",
        "url": "https://api.weather.com/current",
        "method": "GET"
      }
    }
  ]
}
```

### v1.0 Manual Format

```json
{
  "manual_version": "1.0.0",
  "utcp_version": "1.0.1",
  "info": {
    "title": "Weather API",
    "version": "1.0.0",
    "description": "Weather data and forecasting tools"
  },
  "tools": [
    {
      "name": "get_weather",
      "description": "Get weather data",
      "inputs": {
        "type": "object",
        "properties": {
          "location": {"type": "string"}
        },
        "required": ["location"]
      },
      "outputs": {
        "type": "object",
        "properties": {
          "temperature": {"type": "number"},
          "conditions": {"type": "string"}
        }
      },
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.weather.com/current",
        "http_method": "GET",
      },
      "auth": {
        "auth_type": "api_key",
        "api_key": "${API_KEY}",
        "var_name": "appid",
        "location": "query"
      }
      }
    }
  ]
}
```

## Protocol Migration

### HTTP Protocol Changes

#### v0.1 HTTP Provider

```json
{
  "provider_type": "http",
  "url": "https://api.example.com/endpoint",
  "method": "POST",
  "headers": {"Authorization": "Bearer ${TOKEN}"},
  "body": {"data": "${input}"}
}
```

#### v1.0 HTTP Call Template

```json
{
  "call_template_type": "http",
  "url": "https://api.example.com/endpoint",
  "http_method": "POST",
  "headers": {"Authorization": "Bearer ${TOKEN}"},
  "body_field": "body",
  "auth": {
    "auth_type": "api_key",
    "api_key": "${TOKEN}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

### CLI Protocol Changes

#### v0.1 CLI Provider

```json
{
  "provider_type": "cli",
  "command": "python",
  "args": ["script.py", "${input}"],
  "cwd": "/app"
}
```

#### v1.0 CLI Call Template

```json
{
  "call_template_type": "cli",
  "commands": [
    {
      "command": "cd /app",
      "append_to_final_output": false
    },
    {
      "command": "python script.py UTCP_ARG_input_UTCP_END",
      "append_to_final_output": true
    }
  ],
  "working_dir": "/app",
  "env_vars": {
    "PYTHONPATH": "/app/lib"
  }
}
```

## Authentication Migration

### v0.1 Authentication

```json
{
  "provider": {
    "provider_type": "http",
    "url": "https://api.example.com/data",
    "headers": {
      "Authorization": "Bearer ${API_TOKEN}"
    }
  }
}
```

### v1.0 Authentication

```json
{
  "tool_call_template": {
    "call_template_type": "http",
    "url": "https://api.example.com/data",
    "auth": {
      "auth_type": "api_key",
      "api_key": "${API_TOKEN}",
      "var_name": "Authorization",
      "location": "header"
    }
  }
}
```

## Error Handling Migration

### v0.1 Error Handling

**Basic error handling in v0.1:**
- Simple try/catch block with generic Exception handling
- Limited error information and context
- Basic error message printing

### v1.0 Error Handling

**Enhanced error handling in v1.0:**
- Import specific exception types from utcp.exceptions module
- Handle ToolNotFoundError for missing tools
- Handle AuthenticationError for auth failures  
- Handle ToolCallError for tool execution failures
- Handle base UtcpError for general UTCP errors
- Use try/catch blocks with specific exception handling

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
# Uninstall old version
pip uninstall utcp

# Install new version with plugins
pip install utcp utcp-http utcp-cli utcp-websocket utcp-text
```

### Step 2: Update Client Code

**Migration to async pattern:**
- **Before**: Synchronous client creation and tool calls
- **After**: Async client factory method and async tool calls
- Import asyncio module for async execution
- Use async/await keywords for client creation and tool calls
- Run async main function with asyncio.run()

### Step 3: Update Configuration

**Configuration migration helper:**
- Create migration function to convert v0.1 config to v1.0 format
- Transform providers array to manual_call_templates array
- Add variable_loaders configuration for environment variables
- Map provider_type to call_template_type
- Migrate HTTP provider settings (URL, method, headers, body)
- Migrate CLI provider settings (command, args, working_directory)
- Load old configuration and apply migration helper
- Create new client with migrated configuration

### Step 4: Update Manual Format

**Manual migration helper:**
- Create migration function to convert v0.1 manual to v1.0 format
- Update manual_version and utcp_version fields
- Transform provider_info to info structure (title, version, description)
- Migrate tools array with updated structure
- Convert tool parameters to inputs field
- Transform provider configuration to tool_call_template
- Map provider_type to call_template_type
- Migrate HTTP provider settings (URL, method, headers, body)

### Step 5: Test Migration

**Testing migrated client:**
- Import pytest and UtcpClient for async testing
- Create test function with pytest.mark.asyncio decorator
- Test client creation with migrated configuration
- Test tool discovery functionality (list_tools)
- Test tool calling with sample parameters
- Assert expected results and functionality

## Common Migration Issues

### Issue 1: Async/Await

**Problem**: v1.0 client methods are async
**Solution**: Add `async`/`await` keywords

**Code changes:**
- **Before**: Synchronous tool calling (result = client.call_tool("tool", args))
- **After**: Async tool calling (result = await client.call_tool("tool", args))

### Issue 2: Configuration Format

**Problem**: Configuration structure changed
**Solution**: Use migration helper or update manually

**Configuration changes:**
- **Before**: Use "providers" array in configuration
- **After**: Use "manual_call_templates" array in configuration

### Issue 3: Plugin Dependencies

**Problem**: Protocol implementations not found
**Solution**: Install required plugins

```bash
pip install utcp-http utcp-cli utcp-websocket
```

### Issue 4: Manual Format

**Problem**: Old manual format not recognized
**Solution**: Update manual structure

```json
// Before
{"provider": {"provider_type": "http"}}

// After
{"tool_call_template": {"call_template_type": "http"}}
```

## Validation Tools

### Configuration Validator

**Configuration validation helper:**
- Import UtcpClientConfig from utcp.data.utcp_client_config
- Create validation function that accepts configuration dictionary
- Use UtcpClientConfig constructor to validate configuration structure
- Handle validation exceptions and provide error messages
- Return validated config object or None on failure

### Manual Validator

**Manual validation helper:**
- Import UtcpManual from utcp.data.utcp_manual
- Create validation function that accepts manual dictionary
- Use UtcpManual constructor to validate manual structure
- Handle validation exceptions and provide error messages
- Return validated manual object or None on failure

## Best Practices for Migration

1. **Gradual Migration**: Migrate one component at a time
2. **Test Thoroughly**: Test each migrated component
3. **Backup Configurations**: Keep backups of v0.1 configurations
4. **Use Validation**: Validate configurations and manuals
5. **Monitor Performance**: Check for performance regressions
6. **Update Documentation**: Update internal documentation
7. **Train Team**: Ensure team understands new patterns

## Post-Migration Checklist

- [ ] All dependencies updated
- [ ] Client code uses async/await
- [ ] Configuration format updated
- [ ] Manual format updated
- [ ] Error handling updated
- [ ] Tests passing
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Team trained on changes

## Getting Help

If you encounter issues during migration:

1. **Check Documentation**: Review the [Implementation Guide](./implementation.md)
2. **GitHub Issues**: Search existing issues or create new ones
3. **Discord Community**: Join the [UTCP Discord](https://discord.gg/ZpMbQ8jRbD)
4. **Examples**: Check the [examples repository](https://github.com/universal-tool-calling-protocol) for implementations across multiple languages

## Rollback Plan

If migration issues occur, you can rollback:

```bash
# Rollback to v0.1
pip uninstall utcp utcp-http utcp-cli utcp-websocket utcp-text
pip install utcp==0.1.0

# Restore old configuration files
cp config-v0.1-backup.yaml config.yaml
```

Remember to test the rollback process in a non-production environment first.
