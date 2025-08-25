---
title: UTCP API Reference
sidebar_label: API Specification
---

# UTCP API Reference

API specification of a UTCP-compliant client implementation. Any implementation of a UTCP Client needs to have all of the class, functions and fields described in this specification.

This specification is organized by module of the reference python implementation to provide a comprehensive understanding of UTCP's architecture.

**Note:** The modules don't have to be implemented in the same way as in the reference implementation, but all of the functionality here needs to be provided.

**Total documented items:** 189
**Modules documented:** 39

## Core Modules

Core UTCP framework components that define the fundamental interfaces and implementations.

### [utcp.data.auth](./core\utcp\data\auth.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.auth_implementations.api_key_auth](./core\utcp\data\auth_implementations\api_key_auth.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.auth_implementations.basic_auth](./core\utcp\data\auth_implementations\basic_auth.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.auth_implementations.oauth2_auth](./core\utcp\data\auth_implementations\oauth2_auth.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.call_template](./core\utcp\data\call_template.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.register_manual_response](./core\utcp\data\register_manual_response.md)

- **Contains:** 1 classes


### [utcp.data.tool](./core\utcp\data\tool.md)

- **Contains:** 4 classes, 4 methods


### [utcp.data.utcp_client_config](./core\utcp\data\utcp_client_config.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.utcp_manual](./core\utcp\data\utcp_manual.md)

- **Contains:** 2 classes, 2 methods


### [utcp.data.variable_loader](./core\utcp\data\variable_loader.md)

- **Contains:** 2 classes, 3 methods


### [utcp.data.variable_loader_implementations.dot_env_variable_loader](./core\utcp\data\variable_loader_implementations\dot_env_variable_loader.md)

- **Contains:** 2 classes, 3 methods


### [utcp.exceptions.utcp_serializer_validation_error](./core\utcp\exceptions\utcp_serializer_validation_error.md)

- **Contains:** 1 classes


### [utcp.exceptions.utcp_variable_not_found_exception](./core\utcp\exceptions\utcp_variable_not_found_exception.md)

- **Contains:** 1 classes, 1 methods


### [utcp.implementations.default_variable_substitutor](./core\utcp\implementations\default_variable_substitutor.md)

- **Contains:** 1 classes, 2 methods


### [utcp.implementations.in_mem_tool_repository](./core\utcp\implementations\in_mem_tool_repository.md)

- **Contains:** 2 classes, 12 methods


### [utcp.implementations.tag_search](./core\utcp\implementations\tag_search.md)

- **Contains:** 2 classes, 3 methods


### [utcp.implementations.utcp_client_implementation](./core\utcp\implementations\utcp_client_implementation.md)

- **Contains:** 1 classes, 9 methods


### [utcp.interfaces.communication_protocol](./core\utcp\interfaces\communication_protocol.md)

- **Contains:** 1 classes, 4 methods


### [utcp.interfaces.concurrent_tool_repository](./core\utcp\interfaces\concurrent_tool_repository.md)

- **Contains:** 1 classes, 10 methods


### [utcp.interfaces.serializer](./core\utcp\interfaces\serializer.md)

- **Contains:** 1 classes, 3 methods


### [utcp.interfaces.tool_post_processor](./core\utcp\interfaces\tool_post_processor.md)

- **Contains:** 2 classes, 3 methods


### [utcp.interfaces.tool_search_strategy](./core\utcp\interfaces\tool_search_strategy.md)

- **Contains:** 2 classes, 3 methods


### [utcp.interfaces.variable_substitutor](./core\utcp\interfaces\variable_substitutor.md)

- **Contains:** 1 classes, 2 methods


### [utcp.plugins.discovery](./core\utcp\plugins\discovery.md)

- **Contains:** 7 functions


### [utcp.plugins.plugin_loader](./core\utcp\plugins\plugin_loader.md)

- **Contains:** 1 functions


### [utcp.utcp_client](./core\utcp\utcp_client.md)

- **Contains:** 1 classes, 9 methods


## Plugin Modules

Plugin implementations that extend UTCP with specific transport protocols and capabilities.

### [communication_protocols.cli.src.utcp_cli.cli_call_template](./plugins\communication_protocols\cli\src\utcp_cli\cli_call_template.md)

- **Contains:** 2 classes, 2 methods


### [communication_protocols.cli.src.utcp_cli.cli_communication_protocol](./plugins\communication_protocols\cli\src\utcp_cli\cli_communication_protocol.md)

- **Contains:** 1 classes, 4 methods


### [communication_protocols.http.src.utcp_http.http_call_template](./plugins\communication_protocols\http\src\utcp_http\http_call_template.md)

- **Contains:** 2 classes, 2 methods


### [communication_protocols.http.src.utcp_http.http_communication_protocol](./plugins\communication_protocols\http\src\utcp_http\http_communication_protocol.md)

- **Contains:** 1 classes, 4 methods


### [communication_protocols.http.src.utcp_http.openapi_converter](./plugins\communication_protocols\http\src\utcp_http\openapi_converter.md)

- **Contains:** 1 classes, 1 methods


### [communication_protocols.http.src.utcp_http.sse_call_template](./plugins\communication_protocols\http\src\utcp_http\sse_call_template.md)

- **Contains:** 2 classes, 2 methods


### [communication_protocols.http.src.utcp_http.sse_communication_protocol](./plugins\communication_protocols\http\src\utcp_http\sse_communication_protocol.md)

- **Contains:** 1 classes, 4 methods


### [communication_protocols.http.src.utcp_http.streamable_http_call_template](./plugins\communication_protocols\http\src\utcp_http\streamable_http_call_template.md)

- **Contains:** 2 classes, 2 methods


### [communication_protocols.http.src.utcp_http.streamable_http_communication_protocol](./plugins\communication_protocols\http\src\utcp_http\streamable_http_communication_protocol.md)

- **Contains:** 1 classes, 4 methods


### [communication_protocols.mcp.src.utcp_mcp.mcp_call_template](./plugins\communication_protocols\mcp\src\utcp_mcp\mcp_call_template.md)

- **Contains:** 3 classes, 2 methods


### [communication_protocols.mcp.src.utcp_mcp.mcp_communication_protocol](./plugins\communication_protocols\mcp\src\utcp_mcp\mcp_communication_protocol.md)

- **Contains:** 1 classes, 3 methods


### [communication_protocols.text.src.utcp_text.text_call_template](./plugins\communication_protocols\text\src\utcp_text\text_call_template.md)

- **Contains:** 2 classes, 2 methods


### [communication_protocols.text.src.utcp_text.text_communication_protocol](./plugins\communication_protocols\text\src\utcp_text\text_communication_protocol.md)

- **Contains:** 1 classes, 4 methods


## About UTCP

The Universal Tool Calling Protocol (UTCP) is a framework for calling tools across various transport protocols.
This API reference covers all the essential interfaces, implementations, and extension points needed to:

- **Implement** new transport protocols
- **Extend** UTCP with custom functionality
- **Integrate** UTCP into your applications
- **Understand** the complete UTCP architecture