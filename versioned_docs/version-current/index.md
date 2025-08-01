---
sidebar_position: 1
---

# Universal Tool Calling Protocol (UTCP)

The Universal Tool Calling Protocol (UTCP) is a modern, flexible, and scalable standard for defining and interacting with tools across a wide variety of communication protocols. It is designed to be easy to use, interoperable, and extensible, making it a powerful choice for building and consuming tool-based services.

## Key Features

UTCP focuses on three core principles:

- **Scalability**: UTCP is designed to handle a large number of tools and providers without compromising performance.

- **Interoperability**: With support for a wide range of provider types (including HTTP, WebSockets, gRPC, and even CLI tools), UTCP can integrate with almost any existing service or infrastructure.

- **Ease of Use**: The protocol is built on simple, well-defined data models, making it easy for developers to implement and use.

## Philosophy

UTCP is designed with a simple philosophy: a tool-calling protocol should be a descriptive manual, not a prescriptive middleman. A UTCP definition simply tells an agent: "Here is a tool. Here is its **native endpoint** (HTTP, gRPC, CLI, etc.), and here is **how to call it directly**." 

The protocol gets out of the way after discovery, allowing the agent to communicate directly with the tool, which eliminates many common problems:

- **No Wrapper Tax**: Just write a simple JSON definition pointing to your existing REST API, gRPC service, or CLI command. No new server needed.

- **No Performance Overhead**: Agents communicate directly with your tools, eliminating the latency and resource costs of proxy servers.

- **No Feature Limitations**: Your tools can use their full native capabilities. No need to conform to a restrictive protocol.

- **No Vendor Lock-in**: Your tools remain completely independent. You can change or upgrade your infrastructure without affecting your clients.

## Getting Started

Get started with UTCP by exploring our documentation:

- **[Introduction](introduction.md)** - Learn the core concepts and philosophy
- **[For Tool Callers](for-tool-callers.md)** - How to use UTCP as a client
- **[For Tool Providers](for-tool-providers.md)** - How to expose your tools via UTCP
- **[Implementation Guide](implementation.md)** - Detailed technical specifications
