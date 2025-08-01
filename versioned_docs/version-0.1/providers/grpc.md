---
id: grpc
title: gRPC Provider
sidebar_position: 6
---

# gRPC Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.
:::
The gRPC provider enables UTCP to interact with gRPC services, allowing for efficient, schema-driven communication with high performance and low latency.

## Configuration

gRPC providers are configured using the following JSON structure:

```json
{
  "name": "grpc_service",
  "provider_type": "grpc",
  "host": "api.example.com",
  "port": 50051,
  "service_name": "Calculator",
  "method_name": "Add",
  "use_ssl": true,
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "x-api-key"
  }
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"grpc"` |
| `host` | Yes | Hostname or IP address of the gRPC server |
| `port` | Yes | Port number of the gRPC server |
| `service_name` | Yes | Name of the gRPC service to call |
| `method_name` | Yes | Name of the method to call on the service |
| `use_ssl` | No | Whether to use SSL/TLS for the connection (default: `false`) |
| `auth` | No | Authentication configuration (if required) |

## Tool Discovery

Since gRPC doesn't natively support dynamic discovery, UTCP tools can be discovered in one of these ways:

1. **Reflection**: If the gRPC server supports reflection, the UTCP client can query available services and methods
2. **Static Definition**: Tool definitions are provided in a separate JSON file or in the provider configuration
3. **Companion HTTP Endpoint**: A companion HTTP endpoint (typically `/utcp`) that returns the tool definitions

## Authentication

gRPC providers support several authentication methods:

- API Key (via metadata)
- OAuth2 (via token)
- TLS Client Certificates

## Making Tool Calls

When a tool associated with a gRPC provider is called, the UTCP client will:

1. Establish a connection to the gRPC server with the specified host and port
2. Include any authentication metadata
3. Call the specified service method with the input parameters
4. Return the response according to the tool's output schema

## Examples

### Calculator Service

```json
{
  "name": "calculator",
  "provider_type": "grpc",
  "host": "calc.example.com",
  "port": 50051,
  "service_name": "Calculator",
  "method_name": "Add"
}
```

Tool definition:
```json
{
  "name": "add",
  "description": "Add two numbers",
  "inputs": {
    "type": "object",
    "properties": {
      "a": {
        "type": "number",
        "description": "First number"
      },
      "b": {
        "type": "number",
        "description": "Second number"
      }
    },
    "required": ["a", "b"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "result": {
        "type": "number",
        "description": "Sum of the two numbers"
      }
    }
  }
}
```

## Best Practices

1. **Proto Definitions**: Make sure the client has access to the proto definitions for the gRPC service
2. **Connection Pooling**: For high-volume scenarios, implement connection pooling
3. **Timeouts**: Set appropriate deadlines for gRPC calls
4. **Error Handling**: Handle gRPC-specific error codes appropriately
5. **Streaming**: Consider using gRPC streaming for large data transfers or real-time updates

gRPC providers offer significant performance benefits over HTTP-based APIs, making them ideal for high-throughput or latency-sensitive applications.
