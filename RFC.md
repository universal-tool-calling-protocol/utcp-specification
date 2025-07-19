---
title: RFC UTCP 1.0.0
layout: default
nav_order: 10
permalink: /RFC
---

# UTCP 1.0.0

| --- | --- |
| **Status** | Draft |
| **Author** | Razvan-Ion Radulescu |
| **License** | MPL-2.0 |
| **Feedback** | [GitHub](https://github.com/universal-tool-calling-protocol/utcp-specification/issues/18) |

## Summary

This document proposes the Universal Tool Calling Protocol (UTCP), a specification that enables applications, including but not limited to AI agents, to discover and use external tools by interacting with them directly via their native protocols. 

The idea behind it is to decouple a tool call (name of tool and parameters) from the infrastructure required to call it and to do so in a way that levarages existing infrastructure and security.

UTCP does this by specifying a "manual", where a tool provider publishes a standardized description of its "tools" together with the necessary information to call them (named in the following "transport", previously known as "provider"). 

## Motivation

As AI agents become more sophisticated, their need to interact with external systems (APIs, databases, local commands) grows. Current approaches to tool integration often rely on a centralized, middleman architecture. This forces all tool traffic through a new protocol layer, which introduces a "wrapper tax": the significant overhead of building, deploying, and maintaining adapter services for every tool. This model is inefficient, requires reimplementation of existing infrastructure and security measures, and slows down the process of making tools available.

UTCP is motivated by the need for a more efficient, decentralized, and scalable approach. The primary use case is to allow an AI agent to dynamically discover and call any tool—whether it's a public REST API, an internal gRPC service, or a local command-line script—without requiring any changes to the tool itself. We expect the outcome to be a dramatic reduction in the engineering effort required to integrate tools, faster performance due to direct communication, and a more robust and flexible ecosystem where tools can be published and consumed with minimal friction.

### Core Principle

If humans can interact with an API, AI should be able to do the same with no change in the API and the same security guarantees.

### Core Requirements

- **No wrapper tax**: UTCP must be able to call any tool without requiring any changes to the tool itself or the infrastructure required to call it.
- **No security tax**: UTCP must be able to call any tool while guaranteeing the same security as if the tool was called by a human.
- **Scalable**: UTCP must be able to handle a large number of tools and calls.
- **Simple**: UTCP must be simple to implement and use.

## Guide Implementation

Imagine you're a new engineer, and you want to make our company's existing Weather API available to our new AI assistant. With UTCP, you don't need to build a new server; you just need to describe your existing API.

At the core of UTCP is the **"Manual" philosophy**. Instead of forcing your API to speak a new language, you'll simply provide a manual that teaches the AI how to speak your API's language. This manual is a simple JSON file called a `UTCPManual`.

**1. New Concepts:**

*   **`UTCPManual`**: A JSON file that lists all the tools you're making available.
*   **`Tool`**: A definition within the manual for a single function, like `get_weather`. It describes what the tool does, what inputs it needs (e.g., a `location`), and what its output looks like.
*   **`Transport`**: An object containing the technical details for a network call (e.g., protocol, URL, method). While the data structure is the same, it has two distinct roles:
    *   **Manual Discovery**: This `Transport` is used by the client to fetch the `UTCPManual` itself. The client processes this call to discover and register a set of tools.
    *   **Tool Execution**: This `Transport` is embedded within a `Tool` definition and tells the client how to execute that specific tool. The client processes this call to get a result that must match the tool's `outputs` schema.

**2. An Example in Practice:**

To expose your API, you'd define a `manual_transport`. This is simply a way to tell clients where to find your manual. For example, you could have a well-known endpoint `/utcp` on your API server.

The UTCP client in our AI assistant would do the following:
1.  Using a `Transport` for **manual discovery**, it fetches the `UTCPManual` from `https://api.weather.com/utcp`.
2.  It parses the `UTCPManual` and registers all the tools it finds, namespacing them as `weather_api.get_weather`.
3.  When the AI needs to know the weather in San Francisco, the client looks up `weather_api.get_weather`. It finds the `Transport` for **tool execution** embedded in the `get_weather` tool definition and makes a *direct* GET request to `https://api.weather.com/api/weather?location=San%20Francisco`.

**3. Impact and Approach:**

Your goal as an engineer is to **describe, not wrap**. Leverage your existing, battle-tested infrastructure. If you have an OpenAPI (Swagger) spec, you can even generate the `UTCPManual` automatically. This approach is faster, cheaper, and more secure because it relies on the infrastructure you already have.

If something goes wrong, the `UtcpClient` will provide clear errors. For example, if the `/utcp` endpoint is down, you'll get a `UTCPTransportError`. If you try to call a tool that doesn't exist, you'll get a `UTCPToolNotFoundError`.

For existing engineers, the message is simple: you can make your services AI-compatible in minutes by adding a single discovery endpoint or just providing a `UTCPManual` JSON file. For new engineers, UTCP is a lesson in building scalable systems by leveraging direct communication and avoiding unnecessary layers of abstraction.

## Reference Implementation

This section provides the deep technical details for UTCP.

### `UTCPManual` Structure

A `UTCPManual` is a document that contains versioning information and a list of tool definitions. It can be a static JSON file or a dynamically generated object.

```json
{
  "utcp_version": "1.0.0",
  "manual_version": "1.1.0",
  "tools": [ /* Array of Tool objects */ ]
}
```

- **`utcp_version`** (Required `str`): The version of the UTCP specification the manual adheres to.
- **`manual_version`** (Required `str`): The version of the manual itself, for tracking changes to the tool definitions.
- **`tools`** (Required `List[Tool]`): An array of tool definitions.

*Note on Discovery*: How a client discovers a `UTCPManual` (e.g., from a file path or a network endpoint) is a client-side configuration concern and is not part of the manual specification itself.

### The `Tool` Object

Each `Tool` object defines a single function, its inputs/outputs, and the transport needed to execute it.

```json
{
  "name": "get_weather",
  "description": "Get the current weather for a location.",
  "inputs": { /* JSON Schema */ },
  "outputs": { /* JSON Schema */ },
  "tags": ["weather", "location-based"],
  "average_response_size": 256,
  "tool_transport": { /* A Transport object for tool execution */ }
}
```

- **`tags`** (Optional `List[str]`): A list of tags for categorization and search.
- **`average_response_size`** (Optional `int`): An estimated response size in characters, which can help clients manage resources.

### The `Transport` Object

#### Supported Transport Types

The `transport_type` field determines the structure of the `Transport` object and the protocol used for the call. UTCP is designed to be extensible, allowing clients to support custom transport types. The following list includes the core types defined in the reference implementation, but it is not exhaustive:

- **`http`**: Standard RESTful HTTP/S request.
- **`http_sse`**: Server-Sent Events for receiving a stream of updates.
- **`http_ndjson`**: HTTP streaming of Newline Delimited JSON objects.
- **`http_octet_stream`**: HTTP streaming of raw binary data.
- **`cli`**: Executes a local command-line interface tool.
- **`grpc`**: Makes a call to a gRPC service.
- **`graphql`**: Sends a query, mutation, or subscription to a GraphQL endpoint.
- **`mcp`**: Interacts with a service using the Model Context Protocol.
- **`text`**: Reads content from a local text file, often used for loading other manuals or tool definitions.

### Developer Experience: The `@utcp_tool` Decorator

To simplify the process of creating tools, the reference implementation provides a `@utcp_tool` decorator. This allows developers to expose a standard Python function as a UTCP tool with minimal boilerplate. The decorator automatically inspects the function's signature, type hints, and docstrings to generate the `inputs` and `outputs` JSON schemas.

**Example:**
```python
from utcp.server import utcp_tool, HttpProvider

@utcp_tool(
    transport=HttpProvider(url="https://api.weather.com/api/weather"),
    description="Get the current weather for a location.",
    tags=["weather"]
)
def get_weather(location: str) -> dict:
    """Fetches the weather and returns it as a dictionary."""
    # ... implementation ...
    return {"temperature": 72, "conditions": "Sunny"}
```

This code automatically generates a `Tool` definition with the correct name, description, tags, and transport, along with JSON schemas for the `location` input and the dictionary output.

The `Transport` object contains the technical details for a network call. Its structure depends on its `transport_type`.

**Example `http` Transport:**
```json
{
  "transport_type": "http",
  "name": "weather_api_http",
  "url": "https://api.weather.com/api/weather",
  "http_method": "GET",
  "auth": { /* ... */ }
}
```

### Interaction with Other Features

*   **Authentication and Configuration Management**: UTCP delegates authentication to the native protocol, but provides a robust client-side mechanism for managing secrets and other configuration variables securely.

    The client is initialized with a `UtcpClientConfig` object, which defines how variables are loaded. This configuration can pull variables from multiple sources, such as environment variables, `.env` files or secrets management services.

    When a `transport` is processed, the client scans its configuration for placeholders (e.g., `$VAR` or `${VAR}`). It then substitutes these placeholders with the corresponding values loaded into its configuration. This ensures that sensitive data like API keys are never hardcoded in the `UTCPManual`.

    **Example Client Configuration (`UtcpClientConfig`):**
    ```python
    # Client config specifying a .env file for secrets
    client_config = UtcpClientConfig(
        load_variables_from=[
            UtcpDotEnv(env_file_path="/path/to/secrets.env")
        ]
    )
    ```

    **Example Transport with a Variable:**
    ```json
    "auth": {
      "auth_type": "api_key",
      "api_key": "${MY_API_KEY}",
      "var_name": "X-API-Key"
    }
    ```

    Before executing the call, the client replaces `"${MY_API_KEY}"` with the value found in the `UtcpVariablesConfig`. If a variable is not found, the client will raise a `UtcpVariableNotFound` error to prevent an insecure or failed request.
*   **Automatic OpenAPI/Swagger Conversion**: To simplify integration with existing REST APIs, the `http` and `text` transports include a built-in conversion mechanism. If a client using one of these transports fetches a document that is not a valid `UTCPManual`, it will automatically attempt to parse it as an OpenAPI (or Swagger) specification, in either JSON or YAML format. The transport then dynamically converts the API endpoints into `Tool` definitions on the fly, making the API's functions available as UTCP tools without requiring a manual conversion step.

### Corner Cases

*   **CLI Transport Security**: The `cli` transport is powerful but poses a significant security risk. The `tool_transport` for a CLI tool must explicitly define the command and argument structure. It is the responsibility of the *tool publisher* to ensure the underlying script is hardened against injection attacks, and the responsibility of the user to only register and execute tools from trusted manuals.
    ```json
    "tool_transport": {
      "transport_type": "cli",
      "command": "/usr/local/bin/image-resize",
      "args": ["--width", "{width}", "--height", "{height}", "{source_file}"]
    }
    ```
    In this case, the client would substitute the `{width}`, `{height}`, and `{source_file}` placeholders with values from the `inputs`.
*   **Variable Resolution**: If a `Transport` object's configuration contains a variable like `$API_KEY` or `${DOMAIN}`, the client MUST resolve it. Resolution priority is: 1) client-level configuration, 2) environment variables. If a variable is not found, the client MUST fail the call with an error indicating the missing variable.

### Client-Side Tool Management and Scalability

To handle a vast number of tools efficiently, the `UtcpClient` is designed with a flexible architecture for tool storage and retrieval. The client's capabilities are extended through two key injectable components:

*   **`ToolRepository`**: This component is responsible for the persistent storage and retrieval of `Tool` definitions. By default, the client may use a simple in-memory repository, but users can inject a custom implementation to store tools in a database, a file system, or any other backend. This allows the system to manage a virtually unlimited number of tools without overwhelming the client's memory.

*   **`ToolSearchStrategy`**: This component defines the logic for searching through the tools managed by the `ToolRepository`. Users can provide their own search strategies, ranging from simple keyword matching to sophisticated semantic search algorithms. This ensures that even with a large and diverse set of tools, the AI agent can quickly and accurately find the most relevant tool for a given task.

This decoupled design allows developers to tailor the client's storage and search capabilities to their specific needs, ensuring UTCP is scalable enough to support enterprise-level tool ecosystems.

## Drawbacks

The primary drawback of UTCP is that it places more responsibility on the client. Since there is no middleman to normalize behavior, the client must be capable of speaking multiple protocols (HTTP, gRPC, etc.). While `UtcpClient` libraries can abstract this away, the initial complexity is higher than a single-protocol system. Additionally, because the client connects directly to tools, it becomes responsible for service discovery, retries, and timeouts for each transport, whereas a centralized model could handle this in one place.

## Rationale / Alternatives

Why is UTCP the right design?

1.  **MCP (Model Context Protocol)**: The most direct alternative is MCP, which embodies the "middleman" philosophy. MCP requires every tool to be wrapped by an MCP-compliant server. We rejected this approach because the "wrapper tax" is too high. It requires significant engineering effort to build and maintain these wrappers and introduces an unnecessary network hop for every single tool call, increasing latency.

    Furthermore, the MCP approach fails to meet our Core Requirements. It inherently imposes a **wrapper tax** by forcing developers to build and maintain new services instead of using existing ones. It introduces a **security tax** by requiring authentication and authorization to be re-implemented and managed at the MCP layer, rather than leveraging the tool's native, battle-tested security. The model is also less **scalable**. MCP provides no standard way of searching and storing tools, which often forces clients to restrict the number of available tools to 30-40 to fit within the limited context window of the AI model. Finally, it is not **simple**, as it requires significant, ongoing engineering effort to wrap and maintain tools, contrary to UTCP's goal of minimal-friction integration.

2.  **Proprietary SDKs**: Another alternative is for each tool provider to offer its own SDK. This is the status quo and leads to a fragmented ecosystem where an AI agent developer needs to learn and integrate dozens of different libraries. UTCP provides a single, consistent discovery mechanism while still allowing the use of native protocols.

3.  **GraphQL Federation**: One could imagine a federated GraphQL schema for tool access. While powerful, this would impose GraphQL on all tool providers, many of whom have existing REST or gRPC APIs. UTCP was chosen because of its protocol agnosticism, which allows it to integrate with any tool, not just those that conform to a specific query language.

UTCP is the best design because it prioritizes efficiency, scalability, and pragmatism. It meets developers where they are, allowing them to leverage their existing infrastructure with minimal changes.

## Unresolved Questions

*   How should the protocol handle complex, multi-step tool discovery, such as navigating a HATEOAS-style API?
*   Should the `UTCPManual` specification include a more formal mechanism for defining tool versioning and deprecation policies?
*   What is the best practice for a client to discover and trust new UTCP providers on the open internet securely?
*   Should the `UTCPManual` specification include tool chaining, where a tool's output is used as input for another tool?