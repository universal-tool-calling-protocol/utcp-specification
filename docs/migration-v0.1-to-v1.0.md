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

```python
from utcp import UtcpClient

# Old way
client = UtcpClient(config={
    "providers": [
        {
            "name": "weather_service",
            "provider_type": "http",
            "url": "https://weather.example.com/utcp",
            "http_method": "GET"
        }
    ]
})

# Call tool
result = client.call_tool("weather_service.get_weather", {"location": "NYC"})
```

### v1.0 Client Code

```python
from utcp.utcp_client import UtcpClient

# New way - async factory method
client = await UtcpClient.create(config={
    "manual_call_templates": [
        {
            "name": "weather_service",
            "call_template_type": "http",
            "url": "https://weather.example.com/utcp",
            "http_method": "GET"
        }
    ]
})

# Call tool - now async
result = await client.call_tool("weather_service.get_weather", {"location": "NYC"})
```

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

variable_loaders:
  - loader_type: env
    prefix: UTCP_
  - loader_type: dotenv
    file_path: .env
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
        "query_params": {
          "location": "${location}"
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
  "body": {"data": "${input}"},
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
  "command": "python",
  "args": ["script.py", "${input}"],
  "working_directory": "/app",
  "timeout": 30,
  "environment": {
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

```python
try:
    result = client.call_tool("service.tool", args)
except Exception as e:
    print(f"Error: {e}")
```

### v1.0 Error Handling

```python
from utcp.exceptions import (
    UtcpError, 
    ToolNotFoundError, 
    ToolCallError,
    AuthenticationError
)

try:
    result = await client.call_tool("service.tool", args)
except ToolNotFoundError as e:
    print(f"Tool not found: {e}")
except AuthenticationError as e:
    print(f"Authentication failed: {e}")
except ToolCallError as e:
    print(f"Tool call failed: {e}")
except UtcpError as e:
    print(f"UTCP error: {e}")
```

## Step-by-Step Migration

### Step 1: Update Dependencies

```bash
# Uninstall old version
pip uninstall utcp

# Install new version with plugins
pip install utcp utcp-http utcp-cli utcp-websocket utcp-text
```

### Step 2: Update Client Code

```python
# Before
from utcp import UtcpClient

def main():
    client = UtcpClient(config=config)
    result = client.call_tool("service.tool", args)
    return result

# After
import asyncio
from utcp.utcp_client import UtcpClient

async def main():
    client = await UtcpClient.create(config=config)
    result = await client.call_tool("service.tool", args)
    return result

if __name__ == "__main__":
    asyncio.run(main())
```

### Step 3: Update Configuration

```python
# Migration helper function
def migrate_config_v0_to_v1(old_config):
    new_config = {
        "manual_call_templates": [],
        "variable_loaders": [
            {"loader_type": "env", "prefix": "UTCP_"}
        ]
    }
    
    for provider in old_config.get("providers", []):
        call_template = {
            "name": provider["name"],
            "call_template_type": provider["provider_type"],
        }
        
        # Migrate HTTP providers
        if provider["provider_type"] == "http":
            call_template.update({
                "url": provider["url"],
                "http_method": provider.get("method", "GET"),
                "headers": provider.get("headers", {}),
                "body": provider.get("body")
            })
        
        # Migrate CLI providers
        elif provider["provider_type"] == "cli":
            call_template.update({
                "command": provider["command"],
                "args": provider.get("args", []),
                "working_directory": provider.get("cwd")
            })
        
        new_config["manual_call_templates"].append(call_template)
    
    return new_config

# Use migration helper
old_config = load_old_config()
new_config = migrate_config_v0_to_v1(old_config)
client = await UtcpClient.create(config=new_config)
```

### Step 4: Update Manual Format

```python
# Migration helper for manuals
def migrate_manual_v0_to_v1(old_manual):
    new_manual = {
        "manual_version": "1.0.0",
        "utcp_version": "1.0.1",
        "info": {
            "title": old_manual.get("provider_info", {}).get("name", "API"),
            "version": old_manual.get("provider_info", {}).get("version", "1.0.0"),
            "description": old_manual.get("provider_info", {}).get("description", "")
        },
        "tools": []
    }
    
    for tool in old_manual.get("tools", []):
        new_tool = {
            "name": tool["name"],
            "description": tool["description"],
            "inputs": tool.get("parameters", {}),
            "tool_call_template": {}
        }
        
        # Migrate provider to call_template
        provider = tool.get("provider", {})
        if provider.get("provider_type") == "http":
            new_tool["tool_call_template"] = {
                "call_template_type": "http",
                "url": provider["url"],
                "http_method": provider.get("method", "GET"),
                "headers": provider.get("headers", {}),
                "body": provider.get("body")
            }
        
        new_manual["tools"].append(new_tool)
    
    return new_manual
```

### Step 5: Test Migration

```python
import pytest
from utcp.utcp_client import UtcpClient

@pytest.mark.asyncio
async def test_migrated_client():
    # Test with migrated configuration
    client = await UtcpClient.create(config=migrated_config)
    
    # Test tool discovery
    tools = await client.list_tools()
    assert len(tools) > 0
    
    # Test tool calls
    result = await client.call_tool("service.tool", {"param": "value"})
    assert result is not None
```

## Common Migration Issues

### Issue 1: Async/Await

**Problem**: v1.0 client methods are async
**Solution**: Add `async`/`await` keywords

```python
# Before
result = client.call_tool("tool", args)

# After
result = await client.call_tool("tool", args)
```

### Issue 2: Configuration Format

**Problem**: Configuration structure changed
**Solution**: Use migration helper or update manually

```python
# Before
config = {"providers": [...]}

# After
config = {"manual_call_templates": [...]}
```

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

```python
from utcp.data.utcp_client_config import UtcpClientConfig

def validate_config(config_dict):
    try:
        config = UtcpClientConfig(**config_dict)
        print("Configuration is valid!")
        return config
    except Exception as e:
        print(f"Configuration validation failed: {e}")
        return None
```

### Manual Validator

```python
from utcp.data.utcp_manual import UtcpManual

def validate_manual(manual_dict):
    try:
        manual = UtcpManual(**manual_dict)
        print("Manual is valid!")
        return manual
    except Exception as e:
        print(f"Manual validation failed: {e}")
        return None
```

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
4. **Examples**: Check the [examples repository](https://github.com/universal-tool-calling-protocol/python-utcp/tree/main/examples)

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
