---
slug: mcp-servers-nightmare
title: Why MCP Servers Are a Nightmare for Engineers
tags: [mcp, engineering, critique, comparison, utcp]
---

# Why MCP Servers Are a Nightmare for Engineers

*(and what we can learn from the pain)*

> *"I just wanted my LLM to call `cat` on a file. For that, I had to build a stateful server and do so many transactions before I actually get the information. It's wild." – Razvan, early MCP adopter (interview excerpt)*

<!--truncate-->

---

## TL;DR: MCP is just 100x harder than you think

Model Context Protocol (MCP) was sold as the USB-C for AI tools: one simple, standard plug for everything. In practice, it feels more like trying to get a 1990s serial port working on a modern laptop. You end up lost in a jungle of ambiguous specs, wrapper processes, and brittle infrastructure that consumes engineering hours for breakfast.

We sat down with engineers who have been in the MCP trenches. Their stories reveal a protocol that is powerful in theory but punishing in reality.

![Drake meme showing preference for UTCP over MCP](/img/drake-meme.png)

---

## 1. The "What the f*** is STDIO?" Problem

The first hurdle isn't the code; it's the dictionary. The documentation is a maze of conflicting examples and invented jargon that leaves engineers guessing at the most basic concepts.

As Marc, another early adopter, recalls from his first attempt:

> “I implement this class… and then I'm like, okay, let's connect to it. Connect, doesn't work. Why? How? And then I spend a bunch of time and then only realize this only works if the process calling this *is* the process which has this client on it. Which is like, what the fuck?”

This single, poorly explained assumption—that the client *must spawn your server as a child process*—is the source of immense pain. But the confusion runs deeper.

*   **Ambiguous Transports:** The spec says it connects via “STDIO.” But what does that mean? Is it a raw `stdin/stdout` pipe? Is it a custom framing protocol over that pipe? Is it a TCP socket? You only discover the truth through trial and error.
*   **Contradictory Examples:** The official GitHub reference servers receive breaking changes weekly, often without a clear changelog, leaving developers to reverse-engineer why their once-working implementation suddenly fails.

---

## 2. You Have to Ship an Extra App Just to Run Your App

The protocol's architecture forces a clunky, "side-car" model that feels alien to modern development. You can't just expose an MCP interface from your existing application. Instead, you're forced to create a separate "middle-man" process.

Simone shared a particularly harrowing experience trying to build an MCP server for a VS Code extension:

> “To have the client access the VS Code extension, I would need to ship them an extra JavaScript file. And that JavaScript file needs to be run by them to proxy the call from my extension and their client. I have to somehow give them an extra JavaScript file to connect through my extension which they already downloaded. What?”

This got worse in a real-world scenario:

1.  **The Setup:** A user has two VS Code windows open. One project is configured to use OpenAI, the other to use Gemini.
2.  **The MCP Problem:** MCP assumes one server process. When an AI client like Cursor connects to the single JavaScript "bridge," it has no idea which VS Code window (and which configuration) it's supposed to be talking to.
3.  **The Nightmare Hack:** Simone's only solution was to have his extension write the network port into a temporary file so the bridge could find it. He was juggling PIDs and file I/O just to manage state between two windows—a problem created entirely by MCP's rigid process model.

---

## 3. It Forces Statefulness on Stateless Problems

MCP is fundamentally opinionated and designed around long-lived, stateful sessions. It wants to manage *resources*, *prompts*, and *tools* over time. This is great for a complex, multi-turn copilot, but it's massive overkill for 99% of tool use cases.

The result is absurd overhead for simple tasks.

> “I just want my LLM to call `cat` command to read a file, and for that, I have to build a stateful server and do so many transactions before I actually get to my information. It’s wild.”

Want to expose a simple weather API? With MCP, you can't just make a direct call. You first have to build and maintain a persistent server process just to wrap that stateless `GET` request. In contrast, agents should be able to call existing REST or gRPC endpoints *directly*, with no middlemen.

MCP's new HTTP streaming transport solves some of the problems of requiring statefulness, and spinning up extra processes, but introduces its own nest of cobras on scalability. 

---

## 4. It Doesn't Scale for Tools or for Teams

MCP’s design creates scalability bottlenecks at both the technical and organizational levels.

### The Prompt Bloat Problem
How do popular clients like Cline handle multiple tools? They don't have a sophisticated search or routing mechanism. They just jam every single tool definition into the LLM's context window.

> “They inject all of the MCP stuff into the context. Which is crazy... What if I add 100 tools? How do I search for which one is relevant? It's completely omitted in MCP.”

This leads to enormous prompt bloat, wasted tokens, and why many clients have hard caps of 40 tools or less. The protocol itself offers no solution for tool discovery or search, a fundamental requirement for a truly scalable ecosystem.

### The Adoption Headache
For enterprises, the problem is even bigger. A company like Amazon or Microsoft has thousands of existing, battle-tested HTTP APIs.

> “MCP is clearly not easy to adopt because you have to literally build new infrastructure for it... you have to have people which maintain the new code which popped up now to integrate MCP into their existing public APIs.”

Asking every team to re-implement their services behind a stateful MCP wrapper is a non-starter. It introduces a new point of failure, new maintenance costs, and new security surfaces.

---

![MCP Engineering Experience Meme](/img/mcp-meme.png)


## 5. Security Feels Like a Hasty Patch Job

When a protocol adds security as an afterthought, it shows.

> “MCP didn't start with any sort of security... at some point they were like, what, maybe we should add security, which already is a bit of a red flag.”

The current approach is a patchwork of inconsistent, "roll-your-own" solutions:
*   **Undefined Standards:** Authentication often relies on stuffing an OAuth token into an "extra data" field that isn't formally specified. This means every client and server can interpret it differently, breaking interoperability.
*   **Complex Middleware:** If your app uses API keys but the client only supports OAuth, you're forced to build an authentication bridge. You now have a middle-man server whose only job is to translate one security token into another.
*   **Farming Vulnerabilities:** A malicious server can abuse the "server-initiated call" feature to farm your LLM for unlimited completions, running up your token bill without your knowledge.

---

## 6. So… Is there *anything* good?

Yes. MCP is great for giving giving your LLM rich context, just as its name implies. For that, it has two killer features:

1.  **Server-Initiated LLM Calls:** A server can offload a sub-task back to the client’s model. For example, a tool for generating complex code could ask the client's LLM to write the documentation for it, using the client's budget.
2.  **Rich Context Packaging:** For deeply integrated IDE copilots that truly need to manage a web of chained prompts, file resources, and streaming diffs, MCP's stateful structure is powerful.

---
If your goal is simply to let an AI agent call your API, MCP is not the answer today. Sometimes you don't need a "rich context with prompts and resources" to just ask for the weather.

To solve this problem at scale, we've adopted a simple, but intuitive approach: a protocol that allows LLMs to interact with APIs directly, just like developers do. No extra servers, no extra infra. 

If you're interested, you can check the RFC [here](https://www.utcp.io/about/RFC).