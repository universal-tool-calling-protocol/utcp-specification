---
id: graphql
title: GraphQL Protocol
sidebar_position: 7
---

# GraphQL Protocol

The GraphQL protocol plugin enables UTCP to call queries and mutations on any GraphQL endpoint. Tools are discovered through schema introspection.

## Installation

```bash
# Example installation (Python)
pip install utcp-gql

# Example installation (Node.js)
npm install @utcp/graphql
```

In Python, register the plugin before creating the client:

```python
import utcp_gql
utcp_gql.register()
```

In Node.js, importing `@utcp/graphql` registers it.

## Call Template Structure

```json
{
  "name": "my_graph",
  "call_template_type": "graphql",
  "url": "https://api.example.com/graphql",
  "operation_type": "query",
  "headers": {
    "X-Client": "utcp"
  },
  "header_fields": ["x-session-id"],
  "auth": {
    "auth_type": "api_key",
    "api_key": "Bearer ${API_TOKEN}",
    "var_name": "Authorization",
    "location": "header"
  }
}
```

### Key Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `call_template_type` | string | Yes | Always "graphql" |
| `url` | string | Yes | GraphQL endpoint URL |
| `operation_type` | string | No | `query`, `mutation` or `subscription` (default: `query`) |
| `operation_name` | string | No | Operation name sent with the request |
| `query` | string | No | Custom GraphQL document. Takes precedence over auto-generation |
| `variable_types` | object | No | GraphQL types for auto-generated variables, e.g. `{"id": "ID!"}` (default: `String`) |
| `headers` | object | No | Static headers sent with every request |
| `header_fields` | array | No | Tool argument names sent as headers instead of variables |
| `auth` | object | No | Authentication configuration |

## Discovery

Registering a manual sends an introspection query to `url`. Each field on the query, mutation and subscription root types becomes a tool, named `<manual_name>.<field_name>`. Subscriptions are sent as a single HTTP request and return one result; they are not streamed.

## Calling Tools

Without `query`, the operation is generated from the tool name and arguments:

```graphql
query ($id: String) { user(id: $id) }
```

Generated operations have no selection set, so they only work for fields that return scalars. For fields that return objects, provide `query`:

```json
{
  "name": "my_graph",
  "call_template_type": "graphql",
  "url": "https://api.example.com/graphql",
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email } }"
}
```

Tool arguments are passed as GraphQL variables.

UTCP substitutes both `${VAR}` and `$VAR` in call templates, including `query`, so `$id` above is resolved as a UTCP variable when the manual is registered. To keep it literal, define a variable that resolves to itself. Variables are namespaced by manual name, so for `my_graph`:

```json
{
  "variables": {
    "my__graph_id": "$id"
  }
}
```

## Authentication

Supports `api_key` (header), `basic` and `oauth2` (client credentials). See [HTTP authentication](./http.md#authentication-methods) for examples.

## Security

Only `https://` URLs, or `http://` to `localhost`, `127.0.0.1` or `::1`, are accepted.
