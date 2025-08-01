---
id: for-tool-providers
title: For Tool Providers
sidebar_position: 3
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
      "tool_provider": { ... }
    }
  ]
}
```

### Fields

| Field | Description |
|-------|-------------|
| `version` | The version of the UTCP protocol being used |
| `tools` | A list of `Tool` objects representing available tools |

:::important
Tool discovery endpoints should be accessible at a consistent path, preferably `/utcp` for HTTP-based providers.
:::

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
| `tool_provider` | A `Provider` object that describes how to connect to and use the tool |

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

## Generating Tools from an OpenAPI Specification

If you already have an OpenAPI (formerly Swagger) specification for your API, you can automatically generate a `UTCPManual` using the `OpenApiConverter` utility. This saves you from having to manually define each tool.

### Using the Converter

The converter takes an OpenAPI specification in JSON format and produces a `UTCPManual` object. Here's how you can use it in your discovery endpoint:

```python
import json
from fastapi import FastAPI
from utcp.client.openapi_converter import OpenApiConverter

app = FastAPI()

# Load your OpenAPI specification from a file
with open("openapi.json", "r") as f:
    openapi_spec = json.load(f)

@app.get("/utcp")
def utcp_discovery():
    # Convert the OpenAPI spec to a UTCP manual
    converter = OpenApiConverter(openapi_spec)
    utcp_manual = converter.convert()
    return utcp_manual
```

### How it Works

The `OpenApiConverter` maps OpenAPI concepts to UTCP tool definitions:

- **Paths and Methods**: Each combination of a path (e.g., `/users/{id}`) and an HTTP method (`GET`, `POST`, etc.) becomes a separate tool.
- **Operation ID**: The `operationId` from the OpenAPI operation is used as the tool's name.
- **Summary and Description**: The `summary` and `description` fields are used for the tool's description.
- **Parameters**: Request parameters (path, query, header, cookie) are mapped to the tool's `inputs` schema.
- **Request Body**: The `requestBody` is also mapped to the tool's `inputs` schema.
- **Responses**: The successful response (typically `200` or `201`) is mapped to the tool's `outputs` schema.
- **Security Schemes**: The converter automatically detects security schemes (API Key, Basic Auth, OAuth2) and includes the appropriate `auth` configuration in the provider definition. It will even generate placeholder variables for secrets (e.g., `$PROVIDER_API_KEY`).

By using the converter, you can quickly expose your existing API as a set of UTCP tools with minimal effort.

## Provider Types: Manual vs. Tool

It's important to understand the distinction between two types of providers in UTCP:

1.  **Manual Provider**: This is the provider that a `UtcpClient` connects to for **tool discovery**. Its responsibility is to return a `UTCPManual` object (or an OpenAPI specification that can be converted into one). It defines an endpoint for discovery but doesn't execute the tools themselves.

2.  **Tool Provider**: This provider is defined *inside* each `Tool` object within the `UTCPManual`. Its purpose is to provide the specific connection and configuration details needed to **execute that one tool**. The `tool_provider` field contains all the information a client needs to make a call, such as the URL, HTTP method, or command-line arguments.

In simple cases, a single service might act as both a manual provider (at its discovery endpoint) and a tool provider (for the tools it offers). In more complex scenarios, a manual provider could return a manual listing tools from many different tool providers.

## Tool Provider Configuration

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

:::note
Make sure your tool definitions are accurate and complete.
:::

:::warning
Make sure to document which variables users need to set in their environment or configuration.
:::

For details on provider-specific configuration, see the dedicated pages for each type:

- [HTTP Provider](providers/http)
- [HTTP Stream Provider](providers/http-stream)
- [Server-Sent Events (SSE) Provider](providers/sse)
- [WebSocket Provider](providers/websocket)
- [gRPC Provider](providers/grpc)
- [GraphQL Provider](providers/graphql)
- [Command-Line (CLI) Provider](providers/cli)
- [Model Context Protocol (MCP) Provider](providers/mcp)
- [Text File Provider](providers/text)
- [TCP Provider](providers/tcp)
- [UDP Provider](providers/udp)
- [WebRTC Provider](providers/webrtc)

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
