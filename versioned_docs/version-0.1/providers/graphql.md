---
id: graphql
title: GraphQL Provider
sidebar_position: 7
---

# GraphQL Provider (WIP)

The GraphQL provider enables UTCP to interact with GraphQL APIs, allowing for precise data fetching and operations with a flexible query language.

## Configuration

GraphQL providers are configured using the following JSON structure:

```json
{
  "name": "graphql_api",
  "provider_type": "graphql",
  "url": "https://api.example.com/graphql",
  "operation_type": "query",
  "operation_name": "GetUser",
  "auth": {
    "auth_type": "api_key",
    "api_key": "$YOUR_API_KEY",
    "var_name": "Authorization"
  },
  "headers": {
    "User-Agent": "UTCP Client"
  },
  "header_fields": ["client_version"]
}
```

### Configuration Fields

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Unique identifier for the provider |
| `provider_type` | Yes | Must be set to `"graphql"` |
| `url` | Yes | Full URL to the GraphQL endpoint |
| `operation_type` | No | Type of GraphQL operation: `"query"`, `"mutation"`, or `"subscription"` (default: `"query"`) |
| `operation_name` | No | Name of the GraphQL operation (optional) |
| `auth` | No | Authentication configuration (if required) |
| `headers` | No | Additional HTTP headers to include in the request |
| `header_fields` | No | List of input fields to be sent as request headers for the initial connection |

## Tool Discovery

For GraphQL providers, the tool discovery endpoint should be accessible at `/utcp` on the same domain as the API. For example:

```
https://api.example.com/utcp
```

Alternatively, tools can be discovered through introspection of the GraphQL schema.

## Authentication

GraphQL providers support the same authentication methods as HTTP providers:

- API Key (in headers)
- Basic Authentication
- OAuth2

## Making Tool Calls

When a tool associated with a GraphQL provider is called, the UTCP client will:

1. Construct a GraphQL document based on the operation type and input parameters
2. Send a request to the GraphQL endpoint with the appropriate headers and authentication
3. Process the response according to the tool's output schema

## Examples

### User Query

```json
{
  "name": "user_api",
  "provider_type": "graphql",
  "url": "https://api.example.com/graphql",
  "operation_type": "query"
}
```

Tool definition:
```json
{
  "name": "get_user",
  "description": "Get user information by ID",
  "inputs": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "User ID"
      }
    },
    "required": ["id"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "User's name"
      },
      "email": {
        "type": "string",
        "description": "User's email"
      },
      "role": {
        "type": "string",
        "description": "User's role"
      }
    }
  }
}
```

Example GraphQL query:
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    name
    email
    role
  }
}
```

### Product Creation

```json
{
  "name": "product_api",
  "provider_type": "graphql",
  "url": "https://api.example.com/graphql",
  "operation_type": "mutation"
}
```

Tool definition:
```json
{
  "name": "create_product",
  "description": "Create a new product",
  "inputs": {
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "Product name"
      },
      "price": {
        "type": "number",
        "description": "Product price"
      },
      "category": {
        "type": "string",
        "description": "Product category"
      }
    },
    "required": ["name", "price"]
  },
  "outputs": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "New product ID"
      },
      "success": {
        "type": "boolean",
        "description": "Whether the operation was successful"
      }
    }
  }
}
```

## Best Practices

1. **Precise Queries**: GraphQL allows for precise data selection, reducing overhead
2. **Error Handling**: Process GraphQL-specific errors in the response
3. **Batching**: Consider batching multiple operations in a single request when possible
4. **Fragments**: Use fragments for reusable components in GraphQL operations
5. **Rate Limiting**: Be aware of rate limits and implement appropriate throttling

GraphQL providers offer flexible data fetching capabilities, making them ideal for complex data requirements with minimal network overhead.
