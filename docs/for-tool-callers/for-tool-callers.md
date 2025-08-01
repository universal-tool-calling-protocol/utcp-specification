---
id: for-tool-callers
title: For Tool Callers
sidebar_position: 2
---

# For Tool Callers

This guide helps you discover and use UTCP tools in your applications, whether you're building an AI agent, a workflow automation system, or any other tool-consuming application.

## The Discovery Process

Using tools with UTCP follows this simple process:

1. Connect to a tool provider's discovery endpoint
2. Retrieve the `UTCPManual` containing available tools
3. Register the tools in your client
4. Call tools as needed using their native protocols

## Using the UTCP Client

The `utcp` package provides a ready-to-use client for discovering and calling tools. You can configure it with variables and even auto-load providers:

```python
import asyncio
from utcp.client.utcp_client import UtcpClient
from utcp.shared.provider import HttpProvider

async def main():
    # Create a UTCP client
    client = UtcpClient()
    
    # Define the provider
    provider = HttpProvider(
        name="weather_api",
        provider_type="http",
        url="https://api.example.com/utcp",
        http_method="GET"
    )
    
    # Register tools from the provider
    tools = await client.register_tool_provider(provider)
    print(f"Registered {len(tools)} tools from {provider.name}")
    
    # Call a tool with arguments
    result = await client.call_tool("weather_api.get_weather", arguments={"location": "San Francisco"})
    print(f"Weather: {result['temperature']}°C, {result['conditions']}")

if __name__ == "__main__":
    asyncio.run(main())
```

## Integrating with Large Language Models (LLMs)

The `UtcpClient` is designed to be easily integrated into applications that use Large Language Models (LLMs) for function calling. For a complete example of how to use `UtcpClient` with an LLM like OpenAI's GPT, see the example file below:

- [Full LLM Example with OpenAI](https://github.com/universal-tool-calling-protocol/python-utcp/blob/main/example/src/full_llm_example/openai_utcp_example.py)

This example demonstrates how to wrap the `UtcpClient` to make its tools available to an LLM, handle tool calls from the model, and return the results.

## Tool Namespacing

UTCP uses a simple namespacing convention to avoid name conflicts:

```
provider_name.tool_name
```

For example, if a provider named "weather_api" offers a tool named "get_forecast", you would call it using `weather_api.get_forecast`.

## Understanding Tool Definitions

When you register a provider, you receive tool definitions that include:

1. **Name and Description**: What the tool is and what it does
2. **Input Schema**: The parameters the tool accepts
3. **Output Schema**: The structure of the tool's response
4. **Provider Information**: How to call the tool directly

Here's what a typical tool definition looks like:

```json
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
  "tool_provider": {
    "name": "weather_api",
    "provider_type": "http",
    "url": "https://api.example.com/api/weather",
    "http_method": "GET"
  }
}
```

## Error Handling Best Practices

When working with UTCP tools, implement these error handling strategies:

1. **Provider Registration Errors**:
   - Retry with exponential backoff for transient network issues
   - Cache previously discovered tools to maintain functionality when possible
   - Provide clear error messages when a provider is unavailable

2. **Tool Calling Errors**:
   - Validate inputs against the tool's schema before calling
   - Handle HTTP status codes and provider-specific errors
   - Implement timeouts and retry logic for unreliable tools

```python
try:
    result = await client.call_tool("weather_api.get_weather", arguments={"location": "San Francisco"})
except UTCPProviderError as e:
    print(f"Provider error: {e}")
except UTCPToolNotFoundError as e:
    print(f"Tool not found: {e}")
except UTCPValidationError as e:
    print(f"Invalid parameters: {e}")
```

## Working with Different Provider Types

UTCP supports multiple [provider types](providers), and the client handles the protocol differences for you:

- **HTTP providers**: RESTful API calls
- **WebSocket providers**: Real-time bidirectional communication
- **CLI providers**: Local command-line tool execution
- **SSE providers**: Server-sent events for streaming responses
- **Other provider types**: Other provider types in the [Providers](providers) section

The `UTCPClient` automatically uses the appropriate protocol based on its `tool_provider` configuration.

## Provider Types: Manual vs. Tool

It's important to understand the distinction between two types of providers in UTCP:

1.  **Manual Provider**: This is the provider that a `UtcpClient` connects to for **tool discovery**. Its responsibility is to return a `UTCPManual` object (or an OpenAPI specification that can be converted into one). It defines an endpoint for discovery but doesn't execute the tools themselves. You register these with the client.

2.  **Tool Provider**: This provider is defined *inside* each `Tool` object within the `UTCPManual`. Its purpose is to provide the specific connection and configuration details needed to **execute that one tool**. The `tool_provider` field contains all the information a client needs to make a call, such as the URL, HTTP method, or command-line arguments.

When you register a provider with the `UtcpClient`, you are registering a **manual provider**. The client will then use the **tool providers** it discovers in the manual to execute the individual tools.

## Advanced Usage

### Authentication

The UTCP client supports various authentication methods through provider configuration:

```python
from utcp.client.utcp_client import UtcpClient
from utcp.shared.provider import HttpProvider

client = UtcpClient()

# API Key authentication
provider_with_api_key = HttpProvider(
    name="weather_api",
    provider_type="http",
    url="https://api.example.com/utcp",
    http_method="GET",
    auth={
        "auth_type": "api_key",
        "api_key": "$YOUR_API_KEY",
        "var_name": "X-API-Key"
    }
)

# OAuth2 authentication
provider_with_oauth = HttpProvider(
    name="translation_api",
    provider_type="http",
    url="https://translate.example.com/utcp",
    http_method="GET",
    auth={
        "auth_type": "oauth2",
        "client_id": "$YOUR_CLIENT_ID",
        "client_secret": "$YOUR_CLIENT_SECRET",
        "token_url": "https://auth.example.com/token"
    }
)

# Register both providers
await client.register_tool_provider(provider_with_api_key)
await client.register_tool_provider(provider_with_oauth)
```

### Client Configuration

For more complex applications, you can configure the `UtcpClient` using a configuration object. This allows you to externalize provider definitions and manage variables more effectively.

You can initialize the client by passing configuration parameters directly:

```python
from utcp.client.utcp_client import UtcpClient

# Initialize client with configuration parameters
client = await UtcpClient.create(
    providers_file_path="providers.json",
    load_variables_from=[
        {"type": "dotenv", "env_file_path": ".env"}
    ]
)

# Tools are loaded automatically from the providers file
await client.load_tools_from_providers()
```

#### Provider Configuration File (`providers.json`)

The `providers_file_path` points to a JSON file containing a list of manual provider configurations. This allows you to manage your providers without hardcoding them in your application.

Example `providers.json`:

```json
[
  {
    "name": "weather_api",
    "provider_type": "http",
    "url": "https://api.example.com/utcp",
    "http_method": "GET",
    "auth": {
      "auth_type": "api_key",
      "api_key": "$WEATHER_API_KEY",
      "var_name": "X-API-Key"
    }
  }
]
```

#### Variable Management and Substitution

The `load_variables_from` option allows you to load variables from external sources, such as a `.env` file. The client will automatically substitute variables in your provider configurations.

- Values prefixed with `$` (like `$API_KEY`) or enclosed as `${VAR_NAME}` will be replaced.
- The client looks for matching variables in the configuration and then in environment variables.
- If a variable isn't found, the client raises an error.

Example `.env` file:

```
WEATHER_API_KEY="your-secret-api-key"
```

This approach helps keep your secrets and other configuration values secure and separate from your codebase.

### Working with Multiple Providers

You can register and use multiple providers in the same client:

```python
# Register multiple providers
providers = [
    HttpProvider(name="weather_api", provider_type="http", url="https://weather.example.com/utcp", http_method="GET"),
    HttpProvider(name="translate_api", provider_type="http", url="https://translate.example.com/utcp", http_method="GET"),
    HttpProvider(name="image_api", provider_type="http", url="https://image.example.com/utcp", http_method="GET")
]

for provider in providers:
    tools = await client.register_tool_provider(provider)
    print(f"Registered {len(tools)} tools from {provider.name}")

# Access tools from different providers
weather = await client.call_tool("weather_api.get_forecast", arguments={"location": "Tokyo"})
translation = await client.call_tool("translate_api.translate", arguments={"text": "Hello", "target": "fr"})
```

### Deregistering Providers

You can deregister providers when they're no longer needed:

```python
# Deregister a provider by name
await client.deregister_tool_provider("weather_api")
```

### Advanced Customization

The `UtcpClient` is designed to be extensible. For advanced use cases, you can replace its core components with your own custom implementations.

-   **Custom Tool Repositories**: By default, the client stores tools in memory. If you need to persist discovered tools in a database or a file-based cache, you can implement a custom `ToolRepository`. Learn more in the [Tool Repositories](./client/tool-repository) guide.

-   **Custom Tool Search Strategies**: The default search strategy uses tag and description matching. If you need more sophisticated search capabilities, such as semantic search or integration with a vector database, you can implement a custom `ToolSearchStrategy`. Learn more in the [Tool Search Strategies](./client/tool-search-strategy) guide.
