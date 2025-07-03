---
title: UDP Provider
layout: default
parent: Provider Types
nav_order: 9
---

# UDP Provider (WIP)

{: .warning }
> This provider type is currently a Work In Progress (WIP) and may be subject to changes.

The UDP provider enables UTCP to interact with services over User Datagram Protocol, offering low-latency communication with minimal overhead for applications where occasional packet loss is acceptable.

## Configuration

UDP providers are configured using the following JSON structure:

```json
{
  "name": "udp_service",
  "provider_type": "udp",
  "host": "api.example.com",
  "port": 9200,
  "timeout": 30000
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"udp"` |
| `host` | Yes | Hostname or IP address of the UDP server |
| `port` | Yes | Port number of the UDP server |
| `timeout` | No | Operation timeout in milliseconds (default: `30000`) |

## Tool Discovery

Since UDP doesn't support standardized discovery protocols, UTCP tools using UDP providers typically rely on:

1. **Static Definition**: Tool definitions are provided in a separate JSON file or in the provider configuration
2. **Companion HTTP Endpoint**: A companion HTTP endpoint (typically `/utcp`) that returns the tool definitions

## Making Tool Calls

When a tool associated with a UDP provider is called, the UTCP client will:

1. Create a UDP socket
2. Send the serialized input parameters to the specified host and port
3. Wait for a response datagram (if expected)
4. Process the response according to the tool's output schema
5. Close the socket (unless connection pooling is used)

## Protocol Considerations

Since UDP is a connectionless, unreliable protocol:

1. **Message Size**: UDP datagrams have size limitations (typically 65,507 bytes)
2. **Reliability**: No guarantee of delivery, ordering, or duplicate protection
3. **Statelessness**: Each message is independent and must contain all necessary context
4. **Error Handling**: No built-in error reporting or retransmission

## Examples

### Sensor Data Collection

```json
{
  "name": "sensor_network",
  "provider_type": "udp",
  "host": "sensors.example.com",
  "port": 8125
}
```

Tool definition:
```json
{
  "name": "send_reading",
  "description": "Send sensor reading to data collector",
  "inputs": {
    "type": "object",
    "properties": {
      "sensor_id": {
        "type": "string",
        "description": "Unique identifier for the sensor"
      },
      "reading": {
        "type": "number",
        "description": "Sensor reading value"
      },
      "unit": {
        "type": "string",
        "description": "Unit of measurement",
        "default": "C"
      },
      "timestamp": {
        "type": "string",
        "description": "ISO timestamp of reading"
      }
    },
    "required": ["sensor_id", "reading"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "success": {
        "type": "boolean",
        "description": "Whether the reading was recorded"
      }
    }
  }
}
```

## Best Practices

1. **Message Size**: Keep messages small to avoid fragmentation
2. **Idempotency**: Design tools to be idempotent to handle potential duplicate messages
3. **Retry Logic**: Implement application-level retry logic for critical operations
4. **Checksum Validation**: Consider adding application-level checksums to verify data integrity
5. **Batch Processing**: Batch multiple small operations when appropriate to reduce overhead

UDP providers are ideal for high-volume, low-latency applications where occasional packet loss is acceptable, such as metrics collection, real-time monitoring, and multiplayer games.
