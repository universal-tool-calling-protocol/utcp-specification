---
sidebar_position: 1
---




---
sidebar_position: 1
---

# TCP Provider (WIP)

:::warning

> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The TCP provider enables UTCP to interact directly with services over raw TCP sockets, allowing for low-level network communication with minimal protocol overhead.

## Configuration

TCP providers are configured using the following JSON structure:

```json
{
  "name": "tcp_service",
  "provider_type": "tcp",
  "host": "api.example.com",
  "port": 9000,
  "timeout": 30000
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"tcp"` |
| `host` | Yes | Hostname or IP address of the TCP server |
| `port` | Yes | Port number of the TCP server |
| `timeout` | No | Connection and operation timeout in milliseconds (default: `30000`) |

## Tool Discovery

Since raw TCP doesn't support standardized discovery protocols, UTCP tools using TCP providers typically rely on:

1. **Static Definition**: Tool definitions are provided in a separate JSON file or in the provider configuration
2. **Companion HTTP Endpoint**: A companion HTTP endpoint (typically `/utcp`) that returns the tool definitions

## Making Tool Calls

When a tool associated with a TCP provider is called, the UTCP client will:

1. Establish a TCP connection to the specified host and port
2. Send the serialized input parameters according to the tool's protocol
3. Read the response data from the socket
4. Process the response according to the tool's output schema
5. Close the connection (unless persistent connections are used)

## Protocol Considerations

Since TCP is a raw transport protocol, implementations need to define:

1. **Message Framing**: How to determine message boundaries (length prefixes, delimiters, etc.)
2. **Data Serialization**: Format for sending structured data (JSON, Protocol Buffers, custom binary, etc.)
3. **Error Handling**: How errors are communicated in the protocol

## Examples

### Time Server

```json
{
  "name": "time_server",
  "provider_type": "tcp",
  "host": "time.example.com",
  "port": 13
}
```

Tool definition:
```json
{
  "name": "get_time",
  "description": "Get current time from a time server",
  "inputs": {
    "type": "object",
    "properties": {
      "format": {
        "type": "string",
        "description": "Time format",
        "enum": ["short", "long"],
        "default": "short"
      }
    }
  },
  "outputs": {
    "type": "object",
    "properties": {
      "time": {
        "type": "string",
        "description": "Current time"
      },
      "timezone": {
        "type": "string",
        "description": "Timezone"
      }
    }
  }
}
```

## Best Practices

1. **Connection Pooling**: For frequently used services, implement connection pooling
2. **Reconnection Logic**: Implement robust reconnection with backoff for network failures
3. **Timeouts**: Set appropriate timeouts for connection and operations
4. **Message Framing**: Clearly define how message boundaries are determined
5. **Data Validation**: Validate incoming and outgoing data against schemas

TCP providers are ideal for high-performance, low-latency applications where protocol overhead needs to be minimized, or for interacting with legacy systems that use custom TCP protocols.
