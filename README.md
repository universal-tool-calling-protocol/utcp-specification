# Universal Tool Calling Protocol (UTCP) Specification

This repository contains the official specification documentation for the Universal Tool Calling Protocol (UTCP). UTCP is a modern, flexible, and scalable standard for defining and interacting with tools across various communication protocols.

## What is UTCP?

UTCP provides a standardized way for AI systems and other clients to discover and call tools from different providers, regardless of the underlying protocol used (HTTP, WebSocket, CLI, etc.). This specification defines:

- Tool discovery mechanisms
- Tool call formats
- Provider configuration
- Authentication methods
- Response handling

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

## Building the Documentation Locally

### Prerequisites

To build and preview the documentation site locally, you'll need:

- Ruby version 2.5.0 or higher
- RubyGems
- Bundler

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/universal-tool-calling-protocol/utcp-specification.git
   cd utcp-specification
   ```

2. Install dependencies:
   ```bash
   bundle install
   ```

### Running the Documentation Site

To build and serve the site locally:

```bash
bundle exec jekyll serve
```

This will start a local web server at `http://localhost:4000` where you can preview the documentation.

## Documentation Structure

The UTCP documentation is organized as follows:

- `index.md`: Homepage and introduction to UTCP
- `docs/`
  - `introduction.md`: Detailed introduction and core concepts
  - `for-tool-providers.md`: Guide for implementing tool providers
  - `for-tool-callers.md`: Guide for implementing tool callers
  - `providers/`: Documentation for each provider type
    - `http.md`: HTTP provider
    - `websocket.md`: WebSocket provider
    - `cli.md`: CLI provider
    - `sse.md`: Server-Sent Events provider
    - etc.
  - `implementation.md`: Implementation guidelines and best practices

## Working with the Specification

### Modifying the Documentation

The documentation is written in Markdown format with Jekyll front matter. When making changes:

1. Ensure your Markdown follows the established style
2. Preview changes locally before submitting PRs
3. Keep examples up-to-date with the latest specification
4. Update navigation items in `_config.yml` if adding new pages

### File Organization

When adding new documentation:

- Place provider-specific documentation in `docs/providers/`
- Use consistent front matter with appropriate navigation ordering
- Include tags for improved searchability on GitHub Pages

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
