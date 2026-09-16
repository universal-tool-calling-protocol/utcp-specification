---
id: migration-v1.1-to-v1.2
title: Migration Guide - v1.1 to v1.2
sidebar_position: 9
---

# Migration Guide: v1.1 to v1.2

This guide covers the changes in UTCP v1.2 and what you need to update.

## Overview

UTCP v1.2 gives every client **its own protocol instances where that matters, and a `close()` that tears down exactly those**. Until now, every protocol was one instance shared by every client in the process — fine for a credential cache, wrong for MCP sessions or WebSocket connections: a client per tenant, per user or per pooled connection did not actually isolate them, and (in TypeScript) one client's `close()` drained everyone's.

This is a non-breaking change for most users. If you build clients per tenant or per user, or you author a protocol plugin, read on.

## What Changed

### Two ways to register a protocol

A protocol is registered either as a **shared instance** or as a **per-client factory**.

| Registration | Who owns the state | Right for |
|--------------|--------------------|-----------|
| Shared instance (as before) | The process; no client closes it | A credential cache, a registry a decorator writes into |
| Factory (new) | Each client gets its own instance, closed by that client's `close()` | Sessions or connections keyed per manual, child processes — anything one client's use or `close()` would take away from another |

A type registered as a factory wins over the same type registered as an instance, so a plugin migrates by moving its registration and callers change nothing.

**Python**:
```python
from utcp.plugins.discovery import register_communication_protocol_factory

register_communication_protocol_factory("custom", CustomCommunicationProtocol)
```

**TypeScript**:
```typescript
CommunicationProtocol.communicationProtocolFactories['custom'] = () => new CustomCommunicationProtocol();
```

Of the reference plugins, **`mcp` and `websocket` now register as factories**. The HTTP-based plugins (`http`, `sse`, `streamable_http`, `graphql`), `cli`, `text` and `file` stay shared — the only state they keep is an OAuth token cache, which is meant to be reused.

### `client.close()`

`close()` closes the protocol instances the client created — every one of them, even if one fails, after which the failures are raised together. Shared instances are left running.

- **Python**: `UtcpClient.close()` is **new** — there was no way to close a client before. Failures are raised as `UtcpProtocolCloseError` (with `.failures`). `CommunicationProtocol.close()` is now part of the protocol interface, a no-op by default.
- **TypeScript**: `client.close()` existed but closed *every* registered protocol, shared ones included — one client's `close()` cleared `@utcp/http`'s process-wide OAuth cache and `@utcp/direct-call`'s decorator registry for every other client. It now closes only what the client owns. Failures are raised as an `AggregateError`.

### Client creation leaves nothing behind

If `create()` fails after it has created protocol instances — a variable that cannot be resolved, a factory that throws, a manual that fails to register — it closes what it created before re-raising. In Python it also deregisters the manuals that attempt registered, so a caller-supplied tool repository is left as it was found. A failing cleanup is reported, with the original error kept as the one you see.

Batch registration (`register_manuals`) now waits for **every** manual to settle before raising the first failure, so a caller holding the error never has a sibling registration still running underneath it.

### Factories registered later (Python)

A factory registered after a client exists is adopted on the client's first use of that type — created once, owned, and closed by `close()` like the rest. Shared instances were already looked up live.

## Do I Need to Change Anything?

### No Changes Needed If:
- You create one client and use it for the life of the process
- Your manuals use only the HTTP, CLI, text or file protocols

### Changes Recommended If:
- **You create clients per tenant, per user or per request** — call `close()` on each when you are done. In v1.1 there was nothing to close (Python) or closing was unsafe because it drained shared state (TypeScript); in v1.2 it releases exactly that client's MCP sessions, stdio child processes and WebSocket connections.
- **You relied on `client.close()` clearing the shared HTTP OAuth cache** (TypeScript) — it no longer does. Shared instances belong to the process.
- **You author a protocol plugin that keeps per-manual sessions or connections** — register it as a factory, and implement `close()` to release them.

## Migration Steps

### Step 1: Close the clients you create

**Python**:
```python
client = await UtcpClient.create(config=config)
try:
    result = await client.call_tool("my_manual.my_tool", {"id": "123"})
finally:
    await client.close()
```

**TypeScript**:
```typescript
const client = await UtcpClient.create(process.cwd(), config);
try {
  const result = await client.callTool('my_manual.my_tool', { id: '123' });
} finally {
  await client.close();
}
```

### Step 2: If you wrote a plugin, choose its registration

Ask one question: *would one client's use or `close()` of this protocol take something away from another client?* If yes — sessions, connections, child processes — register a factory. If the only state is a cache meant to be shared, keep the instance.

### Step 3: Version pins

The factory registry is new API, so plugins that use it require the new core:

| Package | Version |
|---------|---------|
| `utcp` / `@utcp/sdk` | 1.2.0 |
| `utcp-mcp` / `@utcp/mcp` | 1.2.0 (requires core ≥ 1.2.0) |
| `utcp-websocket` | 1.2.0 (requires core ≥ 1.2.0) |

## Also in This Release Line

`utcp-http` 1.1.14, `utcp-websocket` 1.1.6 and `utcp-gql` 1.1.6 (Python) close a security gap that is independent of v1.2: a redirect is never followed from a non-loopback origin into loopback, and loopback is recognised in every spelling the resolver accepts (`127.1`, `2130706433`, `0177.0.0.1`, `0x7f000001`, a trailing dot). If you are on an older 1.1.x, upgrade for that alone — see the [HTTP protocol's security features](./protocols/http.md#security-features).

## Summary

| Scenario | Action Required |
|----------|-----------------|
| One long-lived client, HTTP/CLI/text/file only | None |
| Clients per tenant / user / request | Call `close()` when done |
| Relied on `close()` clearing shared caches (TypeScript) | Stop relying on it — shared instances are the process's |
| Plugin with per-manual sessions or connections | Register a factory; implement `close()` |
