---
id: index
title: Introduction
sidebar_position: 1
---

# Introduction to UTCP 1.0

The Universal Tool Calling Protocol (UTCP) is a lightweight, secure, and scalable standard for defining and interacting with tools across a wide variety of communication protocols. Version 1.0 introduces a modular core with a plugin-based architecture, making it more extensible, testable, and easier to package.

## Core Components

UTCP consists of four main components:

1. [**Manuals**](./api/core/utcp/data/utcp_manual.md): The standard tool provider description format that contains tool definitions
2. [**Tools**](./api/core/utcp/data/tool.md): The individual capabilities that can be called
3. [**Call Templates**](./api/core/utcp/data/call_template.md): The communication configurations that specify how tools are accessed. Concretely this maps a tool name and provided arguments to an actual API request in a communication protocol.
4. [**UtcpClient**](./api/core/utcp/utcp_client.md): The client that calls tools using the call templates.

## The "Manual" Approach

UTCP's fundamental philosophy is to act as a descriptive manual rather than a prescriptive middleman:

:::note
A UTCP Manual tells an agent: "Here is a tool. Here is its native endpoint (HTTP, WebSocket, CLI, etc.), and here is how to call it directly."
:::

This approach eliminates the need for wrapper servers and allows direct communication between agents and tools.

## New Architecture in 1.0

UTCP has been refactored into a core library and a set of optional plugins:

### Core Package (`utcp`)
- **Data Models**: Pydantic models for [`Tool`](./api/core/utcp/data/tool.md), [`CallTemplate`](./api/core/utcp/data/call_template.md), [`UtcpManual`](./api/core/utcp/data/utcp_manual.md), and [`Auth`](./api/core/utcp/data/auth.md)
- **Pluggable Interfaces**: [`CommunicationProtocol`](./api/core/utcp/interfaces/communication_protocol.md), [`ConcurrentToolRepository`](./api/core/utcp/interfaces/concurrent_tool_repository.md), [`ToolSearchStrategy`](./api/core/utcp/interfaces/tool_search_strategy.md), [`VariableSubstitutor`](./api/core/utcp/interfaces/variable_substitutor.md), [`ToolPostProcessor`](./api/core/utcp/interfaces/tool_post_processor.md)
- **Default Implementations**: [`UtcpClient`](./api/core/utcp/utcp_client.md), [`InMemToolRepository`](./api/core/utcp/implementations/in_mem_tool_repository.md), [`TagAndDescriptionWordMatchStrategy`](./api/core/utcp/implementations/tag_search.md)

### Protocol Plugins
- `utcp-http`: Supports HTTP, SSE, and streamable HTTP, plus an OpenAPI converter
- `utcp-cli`: For wrapping local command-line tools
- `utcp-mcp`: For interoperability with the Model Context Protocol (MCP)
- `utcp-text`: For reading text files
- `utcp-socket`: TCP and UDP protocols (work in progress)
- `utcp-gql`: GraphQL (work in progress)

## Minimal Example

Let's see how easy it is to use UTCP with a minimal example.

### 1. Defining a Tool (Tool Provider)

Create a simple HTTP endpoint that serves a UTCP Manual (JSON):

```python
# app.py
from fastapi import FastAPI

app = FastAPI()

@app.get("/utcp")
def utcp_discovery():
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
                "call_template": {
                    "call_template_type": "http",
                    "url": "https://example.com/api/weather",
                    "http_method": "GET"
                }
            }
        ]
    }

# Implement the actual weather API endpoint
@app.get("/api/weather")
def get_weather(location: str):
    # In a real app, you'd fetch actual weather data
    return {"temperature": 22.5, "conditions": "Sunny"}
```

Run the server:

```bash
uvicorn app:app --reload
```

### 2. Using the Tool (Client)

```python
# client.py
import asyncio
from utcp.utcp_client import UtcpClient
from utcp_http.http_call_template import HttpCallTemplate

async def main():
    # Create a UTCP client with configuration
    client = await UtcpClient.create(config={
        "manual_call_templates": [
            {
                "name": "weather_service",
                "call_template_type": "http",
                "http_method": "GET",
                "url": "http://localhost:8000/utcp"
            }
        ]
    })

    # Tools are automatically registered from the manual call templates
    # Call a tool by its namespaced name: {manual_name}.{tool_name}
    result = await client.call_tool(
        "weather_service.get_weather", 
        tool_args={"location": "San Francisco"}
    )
    print(f"Weather: {result['temperature']}°C, {result['conditions']}")

if __name__ == "__main__":
    asyncio.run(main())
```

Run the client:

```bash
python client.py
```

## Benefits of the UTCP Approach

1. **Direct Communication**: The client calls the tool's native endpoint directly
2. **No Wrapper Infrastructure**: No need to build and maintain wrapper servers
3. **Leverage Existing Systems**: Uses the tool's existing authentication, rate limiting, etc.
4. **Flexible Protocol Support**: Works with any communication protocol (HTTP, WebSockets, CLI, etc.)

In the following sections, we'll explore the details of UTCP's components and how to implement them in your applications.
