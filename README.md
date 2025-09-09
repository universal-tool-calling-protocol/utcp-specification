# Universal Tool Calling Protocol (UTCP) Specification

This repository contains the official specification documentation for the Universal Tool Calling Protocol (UTCP). UTCP is a modern, flexible, and scalable standard for defining and interacting with tools across various communication protocols.

## What is UTCP?

UTCP provides a standardized way for AI systems and other clients to discover and call tools from different providers, regardless of the underlying protocol used (HTTP, WebSocket, CLI, etc.). This specification defines:

- Tool discovery mechanisms
- Tool call formats and templates
- Plugin-based architecture for extensibility
- Enhanced authentication methods
- Comprehensive error handling
- Response processing and validation

## Version 1.0 Features

UTCP v1.0 introduces significant architectural improvements:

- **Plugin Architecture**: Core functionality split into pluggable components for better modularity
- **Enhanced Data Models**: Improved Pydantic models with comprehensive validation
- **Multiple Protocol Support**: HTTP, CLI, WebSocket, Text, and MCP protocols via plugins
- **Advanced Authentication**: Expanded authentication options including API key, OAuth, and custom auth
- **Better Error Handling**: Specific exception types for different error scenarios
- **Performance Optimizations**: Optimized client and protocol implementations
- **Async/Await Support**: Full asynchronous client interface for better performance

## Contributing to the Specification

We welcome contributions to the UTCP specification! Here's how you can contribute:

1. **Fork the repository**: Create your own fork of the specification repository
2. **Make your changes**: Update or add documentation as needed
3. **Submit a pull request**: Open a PR with your changes for review
4. **Participate in discussions**: Join the conversation about proposed changes

When contributing, please follow these guidelines:

- Ensure your changes align with the overall vision and goals of UTCP
- Follow the established documentation structure and formatting
- Include examples when adding new features or concepts
- Update relevant sections to maintain consistency across the documentation

## Installation and Usage

### Core Package Installation

```bash
# Install the core UTCP package
pip install utcp

# Install protocol plugins as needed
pip install utcp-http utcp-cli utcp-websocket utcp-text utcp-mcp
```

### Migration from v0.1 to v1.0

If you're upgrading from UTCP v0.1, please see our comprehensive [Migration Guide](docs/migration-v0.1-to-v1.0.md) which covers:

- Breaking changes and architectural improvements
- Step-by-step migration instructions
- Configuration and manual format updates
- Common migration issues and solutions

## Building the Documentation Locally

### Prerequisites

To build and preview the documentation site locally, you'll need:

- Node.js version 18.0 or higher
- npm or yarn package manager

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/universal-tool-calling-protocol/utcp-specification.git
   cd utcp-specification
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Documentation Site

To build and serve the site locally:

```bash
npm start
```

This will start a local development server at `http://localhost:3000` where you can preview the documentation.

## Documentation Structure

The UTCP documentation is organized as follows:

- `docs/`
  - `index.md`: Homepage and introduction to UTCP
  - `introduction.md`: Detailed introduction and core concepts
  - `for-tool-providers.md`: Guide for implementing tool providers
  - `for-tool-callers.md`: Guide for implementing tool callers
  - `migration-v0.1-to-v1.0.md`: Comprehensive migration guide from v0.1 to v1.0
  - `protocols/`: Documentation for each protocol type
    - `http.md`: HTTP protocol implementation
    - `websocket.md`: WebSocket protocol implementation
    - `cli.md`: CLI protocol implementation
    - `sse.md`: Server-Sent Events protocol implementation
    - `text.md`: Text protocol implementation
    - `mcp.md`: Model Context Protocol implementation
  - `api/`: API reference documentation
    - `core/`: Core API documentation
    - `plugins/`: Plugin API documentation
  - `implementation.md`: Implementation guidelines and best practices
- `versioned_docs/`: Version-specific documentation for backwards compatibility

## Working with the Specification

### Modifying the Documentation

The documentation is built with Docusaurus and written in Markdown format. When making changes:

1. Ensure your Markdown follows the established style
2. Preview changes locally before submitting PRs
3. Keep examples up-to-date with the latest specification (v1.0)
4. Update navigation items in `sidebars.ts` if adding new pages
5. Consider version compatibility when making breaking changes

### File Organization

When adding new documentation:

- Place protocol-specific documentation in `docs/protocols/`
- Place API documentation in `docs/api/core/` or `docs/api/plugins/`
- Use consistent front matter with appropriate navigation ordering
- Include tags for improved searchability
- Consider versioning for breaking changes using `versioned_docs/`

## Version Control

The UTCP specification follows semantic versioning:

- Major versions (1.0, 2.0): Breaking changes to the protocol
- Minor versions (1.1, 1.2): New features added in a backward-compatible manner
- Patch versions (1.0.1, 1.0.2): Backward-compatible bug fixes and clarifications

## License

This specification is distributed under the Mozilla Public License 2.0 (MPL-2.0).

## Additional Resources

- [UTCP GitHub Organization](https://github.com/universal-tool-calling-protocol)
- [UTCP Website](https://utcp.io)
- [Reference Implementations](https://github.com/universal-tool-calling-protocol/python-utcp)
- [Community Discussions](https://github.com/universal-tool-calling-protocol/utcp-specification/discussions)
