---
slug: mcp-servers-nightmare
title: MCP servers are a nightmare for engineers
tags: [mcp, servers, scalability, authentication, engineering, tool-calling]
---

# MCP servers are a nightmare for engineers

> *"If you have more than five tools, an MCP rollout feels like spawning a new micro-service for **every** function call. We ended up with 40 tiny servers, 40 sets of secrets, and one giant Ops headache."*  
> — *Engineering team at a Series B startup*  

MCP (Model Context Protocol) was supposed to "standardise tool calling for LLMs." Instead it created a forest of mini-services that crumble under real-world scale and expose brand-new security holes. Here's why production teams are quietly ripping MCP back out of their stacks.

<!--truncate-->

---

## 1. One API ⇒ One MCP server ⇒ One scaling nightmare

**Design flaw:** Every tool definition lives behind its own long-running MCP server. A project with 20 tools is now a 20-service deployment. Horizontal scaling becomes a Knuthian combinatorial explosion:

```yaml
# naïve K8s layout
weather-mcp   ×  N replicas
db-mcp        ×  N replicas
payment-mcp   ×  N replicas
# ... and so on
```

*   **Orchestration overhead:** service discovery, health checks, autoscaling rules, and CI/CD pipelines multiply linearly.  
*   **Resource thrash:** idle MCP servers still hold sockets and memory; at peak they compete for the same CPU shares.  
*   **Cold-start pain:** spawning a new server per customer or per tenant means hundreds of containers during load spikes — exactly the kind of burst K8s is slowest to absorb.  

Even MCP contributors admit that "one server per API sounds crazy if you're doing backend" after wrestling with dozens of them in production.

---

## 2. “Bring-your-own-auth” is a security trap

The spec punts on authentication, so every vendor rolled their own:

* **OAuth, mutual-TLS, Static tokens,** or — far too often — **nothing at all.** Engineers joke that "the S in MCP stands for Security" precisely because it doesn't.  
* **Key-store of doom:** each server needs credentials for the upstream tool *and* for the calling agent. When one leaks, the blast radius includes *every* downstream service accessible through that server. Hackers love a single vault full of all your API keys.  
* **Proven attack vectors:** MCP servers often run with elevated privileges and expose additional attack surface through their custom authentication mechanisms.  

The security model fundamentally breaks down when you have dozens of independent servers, each implementing their own auth patterns.

---

## 3. Debugging distributed auth failures, not latency numbers

Latency is fixable with caches; **broken auth flows** cascade:

1. Token refresh fails in one MCP server.  
2. All agents routed to that pod get 401s.  
3. Autoscaler spawns more replicas of the *broken* image.  
4. Your incident channel fills with “tool unavailable” alerts while dashboards stay green (the servers are *up*, just unauthorised).

Tracing the root cause means correlating logs across **agent → client SDK → MCP server → tool → identity provider**. That’s five codebases, often in five languages.

---

## 4. MCP locks you *out* of real scaling patterns

MCP’s JSON-RPC-over-stdio/HTTP tunnel ignores native features of the protocols it proxies:

* **WebSockets & streaming gRPC**: forced back into polling loops; throughput nose-dives when messages surge.  
* **Binary blobs**: base64 inflation wrecks memory-bandwidth-sensitive workloads (vision, audio).  
* **Fan-out fan-in patterns**: you still need a coordinator outside MCP, defeating its “single interface” pitch.  

Teams building high-frequency trading bots reported a 20× drop in tick rate once they moved feeds through MCP.

---

## A labyrinth of servers

If you've already tackled the operational complexity listed above and think MCP servers are a good investment of your engineering time, go ahead — just make sure to budget for the maintenance work that's inevitably needed. Another option is to adopt existing MCP server frameworks and accept the architectural trade-offs.

To solve this problem at scale, we've been experimenting with a more boring approach: **UTCP (Universal Tool Calling Protocol)**. The idea is simple: let your agents speak the tool's native protocol directly, without a proxy layer.

The architecture is much less interesting: tools are just API definitions, calls go direct to the service, and you reuse whatever auth infrastructure you already have. It scales like any stateless API because that's exactly what it is.

---

### Bottom line

**MCP is great for what it was designed for:** sharing prompts, resources, and context between AI systems. When you need to give an LLM access to your company knowledge base or standardize prompt templates, MCP shines.

**But tool calling? That's where MCP becomes a nightmare.**

Forcing every API call through a JSON-RPC proxy server turns simple HTTP requests into distributed systems nightmares. You end up with **microservices-sprawl-as-a-spec** combined with DIY security theatre. If your architecture already struggles with too many services and secrets, MCP's tool calling approach adds gasoline to the fire.

For tool calling, the fastest fix is the simplest: delete the proxy, call the API directly.
