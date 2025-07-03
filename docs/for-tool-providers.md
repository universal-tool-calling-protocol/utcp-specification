---
title: For Tool Providers
layout: default
nav_order: 3
---

# For Tool Providers

This guide helps you expose your tools through UTCP so they can be discovered and used by AI agents and other applications.

## Creating a UTCP Manual

A UTCP Manual is the standardized description of your tools. To create one, you need to define:

1. Your tools and their capabilities
2. The provider information for calling those tools

### The `UTCPManual` Structure

Your discovery endpoint should return a `UTCPManual` object with the following structure:

```json
{
  "version": "1.0",
  "tools": [
    {
      "name": "tool_name",
      "description": "tool_description",
      "inputs": { ... },
      "outputs": { ... },
      "tags": ["tag"],
      "provider": { ... }
    }
  ]
}
```

### Fields

| Field | Description |
|-------|-------------|
| `version` | The version of the UTCP protocol being used |
| `tools` | A list of `Tool` objects representing available tools |

{: .important }
Tool discovery endpoints should be accessible at a consistent path, preferably `/utcp` for HTTP-based providers.

## Tool Definition

Each tool in your manual should be defined by a `Tool` object:

```json
{
  "name": "tool_name",
  "description": "tool_description",
  "inputs": {
    "type": "object",
    "properties": { ... },
    "required": ["string"],
    "description": "parameters_description",
    "title": "parameters"
  },
  "outputs": { ... },
  "tags": ["string"],
  "average_response_size": 200,
  "provider": { ... }
}
```

### Fields

| Field | Description |
|-------|-------------|
| `name` | The name of the tool (should be unique within your provider) |
| `description` | A clear, concise description of what the tool does |
| `inputs` | A schema defining the input parameters (follows simplified JSON Schema) |
| `outputs` | A schema defining the output format (follows simplified JSON Schema) |
| `tags` | Optional list of tags for categorization and search |
| `average_response_size` | Optional integer indicating the estimated average number of tokens returned by this tool |
| `provider` | A `Provider` object that describes how to connect to and use the tool |

### Input and Output Schemas

Both `inputs` and `outputs` use a simplified JSON Schema format:

```json
{
  "type": "object",
  "properties": {
    "param1": {
      "type": "string",
      "description": "Description of parameter 1"
    },
    "param2": {
      "type": "integer",
      "description": "Description of parameter 2"
    }
  },
  "required": ["param1"],
  "description": "Overall description of the input/output",
  "title": "Optional title"
}
```

### Best Practices for Tool Definitions

1. **Clear Descriptions**: Provide clear, concise descriptions for both tools and parameters
2. **Precise Types**: Use the most specific schema types to help clients validate inputs
3. **Required Fields**: Explicitly list all required parameters
4. **Complete Output Schemas**: Define output schemas thoroughly to help clients parse responses
5. **Meaningful Names**: Use descriptive, action-oriented names for tools (e.g., `get_weather`, `translate_text`)
6. **Logical Tags**: Use tags to group related tools and aid in discovery

## Provider Configuration

The provider object tells clients how to call your tool:

```json
{
  "name": "provider_name",
  "provider_type": "http",
  ... (protocol-specific attributes)
}
```

### Variable Substitution

You can use variables in your provider configuration by prefixing values with `$` or enclosing them in `${...}`. These variables will be replaced with values from the client's configuration or environment variables when the tool is called.

```json
{
  "auth": {
    "auth_type": "api_key",
    "api_key": "$API_KEY",
    "var_name": "X-API-Key"
  }
}
```

You can also use the `${VAR}` syntax for more complex strings:

```json
{
  "url": "https://${DOMAIN}/api/v1/endpoint"
}
```

{: .important }
When providing tool definitions, make sure to document which variables users need to set in their environment or configuration.

For details on provider-specific configuration, see:
- [HTTP Provider](providers/http)
- [WebSocket Provider](providers/websocket)
- [CLI Provider](providers/cli)
- [SSE Provider](providers/sse)
- Other provider types in the [Providers](providers) section

## Implementing a Discovery Endpoint

For HTTP-based providers, implement a discovery endpoint at `/utcp` that returns your UTCP Manual:

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

class UTCPManual(BaseModel):
    version: str
    tools: List[Dict[str, Any]]

@app.get("/utcp")
def utcp_discovery():
    return UTCPManual(
        version="1.0",
        tools=[
            {
                "name": "get_weather",
                "description": "Get current weather for a location",
                "inputs": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "City name"
                        }
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
                "provider": {
                    "name": "weather_api",
                    "provider_type": "http",
                    "url": "https://api.example.com/api/weather",
                    "http_method": "GET"
                },
                "tags": ["weather", "current"],
                "average_response_size": 150
            }
        ]
    )
```

## Testing Your UTCP Manual

To ensure your UTCP Manual is valid and functional:

1. Validate the JSON against the UTCP schema
2. Test with the `utcp` command-line tool: `utcp test --url https://your-api.com/utcp`
3. Try registering with a UTCP client and calling your tools

For more detailed implementation guidance, see the [Implementation](implementation) page.
