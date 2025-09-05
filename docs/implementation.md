---
id: implementation
title: Implementation Guide
sidebar_position: 4
---

# Implementation Guide

:::info Language Note
This guide uses **Python** examples with the reference implementation. UTCP implementations are available in multiple languages - check the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol) for TypeScript, Go, and other language implementations.
:::

This comprehensive guide walks you through implementing UTCP in your applications, whether you're creating a tool provider or building a client that consumes tools.

## Quick Start (Python)

### 1. Install UTCP

```bash
# Core UTCP library
pip install utcp

# Protocol plugins (install as needed)
pip install utcp-http utcp-cli utcp-websocket utcp-text
```

### 2. Create Your First Tool Provider

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/utcp")
def get_utcp_manual():
    return {
        "manual_version": "1.0.0",
        "utcp_version": "1.0.1",
        "tools": [
            {
                "name": "get_weather",
                "description": "Get current weather for a location",
                "inputs": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "City name"}
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
                    "url": "https://api.weather.com/v1/current",
                    "http_method": "GET",
                    "query_params": {
                        "q": "${location}",
                        "appid": "${WEATHER_API_KEY}"
                    }
                }
            }
        ]
    }
```

### 3. Create Your First Client

```python
import asyncio
from utcp.utcp_client import UtcpClient

async def main():
    # Create client with manual discovery
    client = await UtcpClient.create(config={
        "manual_call_templates": [
            {
                "name": "weather_service",
                "call_template_type": "http",
                "url": "http://localhost:8000/utcp",
                "http_method": "GET"
            }
        ]
    })
    
    # Call the tool
    result = await client.call_tool(
        "weather_service.get_weather",
        tool_args={"location": "San Francisco"}
    )
    print(f"Weather: {result}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Other Language Implementations

UTCP is available in multiple programming languages:

| Language | Repository | Status |
|----------|------------|--------|
| **Python** | [python-utcp](https://github.com/universal-tool-calling-protocol/python-utcp) | ✅ Reference Implementation |
| **TypeScript** | [typescript-utcp](https://github.com/universal-tool-calling-protocol/typescript-utcp) | ✅ Stable |
| **Go** | [go-utcp](https://github.com/universal-tool-calling-protocol/go-utcp) | 🚧 In Development |
| **Rust** | [rust-utcp](https://github.com/universal-tool-calling-protocol/rust-utcp) | 🚧 In Development |

Visit the respective repositories for language-specific documentation and examples.

## Tool Provider Implementation (Python)

### Manual Structure

A UTCP Manual defines your tools and how to call them:

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
      "description": "Get current weather conditions",
      "inputs": {
        "type": "object",
        "properties": {
          "location": {"type": "string"},
          "units": {"type": "string", "enum": ["metric", "imperial"]}
        },
        "required": ["location"]
      },
      "outputs": {
        "type": "object",
        "properties": {
          "temperature": {"type": "number"},
          "conditions": {"type": "string"},
          "humidity": {"type": "number"}
        }
      },
      "tool_call_template": {
        "call_template_type": "http",
        "url": "https://api.weather.com/v1/current",
        "http_method": "GET",
        "query_params": {
          "q": "${location}",
          "units": "${units}",
          "appid": "${WEATHER_API_KEY}"
        },
        "auth": {
          "auth_type": "api_key",
          "api_key": "${WEATHER_API_KEY}",
          "var_name": "appid",
          "location": "query"
        }
      }
    }
  ]
}
```

### Discovery Endpoint (Python Examples)

Expose your manual via a discovery endpoint:

#### FastAPI Example

```python
from fastapi import FastAPI
from utcp.data.utcp_manual import UtcpManual
from utcp.data.tool import Tool, JsonSchema
from utcp.data.call_template import CallTemplate

app = FastAPI()

# Define your manual
manual = UtcpManual(
    manual_version="1.0.0",
    utcp_version="1.0.1",
    tools=[
        Tool(
            name="get_weather",
            description="Get current weather",
            inputs=JsonSchema(
                type="object",
                properties={
                    "location": JsonSchema(type="string")
                },
                required=["location"]
            ),
            tool_call_template=CallTemplate(
                call_template_type="http",
                url="https://api.weather.com/v1/current",
                http_method="GET",
                query_params={
                    "q": "${location}",
                    "appid": "${WEATHER_API_KEY}"
                }
            )
        )
    ]
)

@app.get("/utcp")
def get_manual():
    return manual.model_dump()
```

#### Flask Example

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/utcp')
def get_manual():
    return jsonify({
        "manual_version": "1.0.0",
        "utcp_version": "1.0.1",
        "tools": [
            # ... tool definitions
        ]
    })
```

### Authentication Patterns (Python)

#### API Key in Header

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${API_KEY}",
    "var_name": "X-API-Key",
    "location": "header"
  }
}
```

#### Bearer Token

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "${ACCESS_TOKEN}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

#### OAuth2

```json
{
  "auth": {
    "auth_type": "oauth2",
    "client_id": "${CLIENT_ID}",
    "client_secret": "${CLIENT_SECRET}",
    "token_url": "https://auth.example.com/token",
    "scope": "read:data"
  }
}
```

## Client Implementation (Python)

### Basic Client Setup

```python
from utcp.utcp_client import UtcpClient

# Create client with configuration
client = await UtcpClient.create(config={
    "manual_call_templates": [
        {
            "name": "my_service",
            "call_template_type": "http",
            "url": "https://api.example.com/utcp",
            "http_method": "GET"
        }
    ],
    "variable_loaders": [
        {
            "loader_type": "env",
            "prefix": "UTCP_"
        }
    ]
})
```

### Configuration Options (Python)

#### File-based Configuration

```yaml
# utcp-config.yaml
manual_call_templates:
  - name: weather_service
    call_template_type: http
    url: https://weather.example.com/utcp
    http_method: GET
  - name: database_service
    call_template_type: http
    url: https://db.example.com/utcp
    http_method: GET

variable_loaders:
  - loader_type: env
    prefix: UTCP_
  - loader_type: dotenv
    file_path: .env
```

```python
client = await UtcpClient.create(config="utcp-config.yaml")
```

#### Programmatic Configuration

```python
from utcp.data.utcp_client_config import UtcpClientConfig
from utcp.data.call_template import CallTemplate

config = UtcpClientConfig(
    manual_call_templates=[
        CallTemplate(
            name="weather_service",
            call_template_type="http",
            url="https://weather.example.com/utcp",
            http_method="GET"
        )
    ]
)

client = await UtcpClient.create(config=config)
```

### Tool Discovery and Search (Python)

#### List Available Tools

```python
# Get all tools
tools = await client.list_tools()
for tool in tools:
    print(f"{tool.name}: {tool.description}")

# Search tools by tag
weather_tools = await client.search_tools(tags=["weather"])

# Search tools by description
data_tools = await client.search_tools(description="data processing")
```

#### Tool Information

```python
# Get detailed tool information
tool_info = await client.get_tool("weather_service.get_weather")
print(f"Inputs: {tool_info.inputs}")
print(f"Outputs: {tool_info.outputs}")
```

### Calling Tools (Python)

#### Basic Tool Call

```python
result = await client.call_tool(
    "weather_service.get_weather",
    tool_args={"location": "New York"}
)
```

#### Tool Call with Context

```python
result = await client.call_tool(
    "weather_service.get_weather",
    tool_args={"location": "New York"},
    context={"user_id": "123", "session_id": "abc"}
)
```

#### Batch Tool Calls

```python
results = await client.call_tools([
    ("weather_service.get_weather", {"location": "New York"}),
    ("weather_service.get_weather", {"location": "London"}),
    ("weather_service.get_weather", {"location": "Tokyo"})
])
```

### Error Handling (Python)

```python
from utcp.exceptions import UtcpError, ToolNotFoundError, ToolCallError

try:
    result = await client.call_tool("nonexistent.tool", {})
except ToolNotFoundError as e:
    print(f"Tool not found: {e}")
except ToolCallError as e:
    print(f"Tool call failed: {e}")
except UtcpError as e:
    print(f"UTCP error: {e}")
```

## Advanced Implementation Patterns (Python)

### Custom Communication Protocol Plugins

```python
from utcp.interfaces.communication_protocol import CommunicationProtocol
from utcp.data.call_template import CallTemplate
from typing import Dict, Any, List

class CustomProtocol(CommunicationProtocol):
    def get_supported_call_template_types(self) -> List[str]:
        return ["custom"]
    
    async def call_tool(
        self, 
        call_template: CallTemplate, 
        tool_args: Dict[str, Any]
    ) -> Any:
        # Implement your custom protocol logic
        return {"result": "custom protocol response"}

# Register the protocol
from utcp.plugins.discovery import register_communication_protocol
register_communication_protocol(CustomProtocol())
```

### Custom Tool Repository

```python
from utcp.interfaces.concurrent_tool_repository import ConcurrentToolRepository
from utcp.data.tool import Tool
from typing import List, Optional

class DatabaseToolRepository(ConcurrentToolRepository):
    async def add_tool(self, tool: Tool, manual_name: str) -> None:
        # Store tool in database
        pass
    
    async def get_tool(self, namespaced_name: str) -> Optional[Tool]:
        # Retrieve tool from database
        pass
    
    async def list_tools(self) -> List[Tool]:
        # List all tools from database
        pass
    
    # ... implement other methods

# Use custom repository
client = await UtcpClient.create(
    config=config,
    tool_repository=DatabaseToolRepository()
)
```

## Testing (Python)

### Unit Testing Tool Providers

```python
import pytest
from fastapi.testclient import TestClient
from your_app import app

client = TestClient(app)

def test_utcp_manual():
    response = client.get("/utcp")
    assert response.status_code == 200
    
    manual = response.json()
    assert manual["manual_version"] == "1.0.0"
    assert len(manual["tools"]) > 0
    
    tool = manual["tools"][0]
    assert "name" in tool
    assert "description" in tool
    assert "tool_call_template" in tool
```

### Integration Testing

```python
import pytest
from utcp.utcp_client import UtcpClient

@pytest.mark.asyncio
async def test_tool_call():
    client = await UtcpClient.create(config={
        "manual_call_templates": [
            {
                "name": "test_service",
                "call_template_type": "http",
                "url": "http://localhost:8000/utcp",
                "http_method": "GET"
            }
        ]
    })
    
    result = await client.call_tool(
        "test_service.get_weather",
        tool_args={"location": "Test City"}
    )
    
    assert "temperature" in result
    assert "conditions" in result
```

## Language-Specific Resources

### Python
- **Repository**: [python-utcp](https://github.com/universal-tool-calling-protocol/python-utcp)
- **Documentation**: [Python UTCP Docs](https://python-utcp.readthedocs.io/)
- **Examples**: [Python Examples](https://github.com/universal-tool-calling-protocol/python-utcp/tree/main/examples)

### TypeScript
- **Repository**: [typescript-utcp](https://github.com/universal-tool-calling-protocol/typescript-utcp)
- **Documentation**: [TypeScript UTCP Docs](https://typescript-utcp.readthedocs.io/)
- **Examples**: [TypeScript Examples](https://github.com/universal-tool-calling-protocol/typescript-utcp/tree/main/examples)

### Other Languages
Check the [UTCP GitHub organization](https://github.com/universal-tool-calling-protocol) for the latest language implementations and their respective documentation.

## Best Practices

### Tool Provider Best Practices

1. **Versioning**: Use semantic versioning for your manual
2. **Documentation**: Provide clear descriptions for all tools
3. **Validation**: Validate inputs using JSON Schema
4. **Error Handling**: Return meaningful error messages
5. **Rate Limiting**: Implement appropriate rate limits
6. **Monitoring**: Monitor tool usage and performance
7. **Security**: Implement proper authentication and authorization

### Client Best Practices

1. **Configuration Management**: Use external configuration files
2. **Error Handling**: Implement comprehensive error handling
3. **Retry Logic**: Implement retry logic for transient failures
4. **Caching**: Cache tool definitions and results when appropriate
5. **Monitoring**: Monitor client performance and errors
6. **Testing**: Write comprehensive tests for tool integrations
7. **Security**: Store credentials securely

## Next Steps

1. **Choose Your Language**: Select from available UTCP implementations
2. **Choose Your Protocols**: Select the communication protocols you need
3. **Design Your Tools**: Plan your tool structure and interfaces
4. **Implement Gradually**: Start with simple tools and expand
5. **Test Thoroughly**: Write comprehensive tests
6. **Monitor and Optimize**: Monitor performance and optimize as needed
7. **Scale**: Plan for scaling as your tool ecosystem grows

For more detailed information, see:
- [Communication Protocol Plugins](./protocols/index.md)
- [API Reference](./api/index.md)
- [Security Considerations](./security.md)
