---
title: Home
layout: home
nav_order: 1
---

# Universal Tool Calling Protocol (UTCP)

## Overview

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

- **Leverage Existing Infrastructure**: Authentication, permissions, and billing are handled by the tool's native endpoint, as they should be. No re-implementation required.

- **Efficient & Direct**: The agent calls the tool directly. This means lower latency, less overhead, and access to the tool's native, structured data.

## Quick Start

To get started with UTCP:

1. [Introduction](docs/introduction) - Learn about the basic concepts and components
2. [Provider Types](docs/providers) - Explore the various provider types supported by UTCP
3. [Implementation Guide](docs/implementation) - Start implementing UTCP in your applications
