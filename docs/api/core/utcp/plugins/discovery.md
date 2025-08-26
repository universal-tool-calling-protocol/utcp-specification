---
title: discovery
sidebar_label: discovery
---

# discovery

**File:** `core/src/utcp/plugins/discovery.py`

### Function register_auth(auth_type: str, serializer: [Serializer](./../interfaces/serializer.md#serializer)[[Auth](./../data/auth.md#auth)], override: bool) -> bool {#register_auth}

<details>
<summary>Documentation</summary>

Register an authentication implementation.


**Args**

- **`auth_type`**: The authentication type identifier.
- **`serializer`**: The serializer for the authentication implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---

### Function register_variable_loader(loader_type: str, serializer: [Serializer](./../interfaces/serializer.md#serializer)[[VariableLoader](./../data/variable_loader.md#variableloader)], override: bool) -> bool {#register_variable_loader}

<details>
<summary>Documentation</summary>

Register a variable loader implementation.


**Args**

- **`loader_type`**: The variable loader type identifier.
- **`serializer`**: The serializer for the variable loader implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---

### Function register_call_template(call_template_type: str, serializer: [Serializer](./../interfaces/serializer.md#serializer)[[CallTemplate](./../data/call_template.md#calltemplate)], override: bool) -> bool {#register_call_template}

<details>
<summary>Documentation</summary>

Register a call template implementation.


**Args**

- **`call_template_type`**: The call template type identifier.
- **`serializer`**: The serializer for the call template implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---

### Function register_communication_protocol(communication_protocol_type: str, communication_protocol: [CommunicationProtocol](./../interfaces/communication_protocol.md#communicationprotocol), override: bool) -> bool {#register_communication_protocol}

<details>
<summary>Documentation</summary>

Register a communication protocol implementation.


**Args**

- **`communication_protocol_type`**: The communication protocol type identifier.
- **`communication_protocol`**: The communication protocol implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---

### Function register_tool_repository(tool_repository_type: str, tool_repository: [Serializer](./../interfaces/serializer.md#serializer)[[ConcurrentToolRepository](./../interfaces/concurrent_tool_repository.md#concurrenttoolrepository)], override: bool) -> bool {#register_tool_repository}

<details>
<summary>Documentation</summary>

Register a tool repository implementation.


**Args**

- **`tool_repository_type`**: The tool repository type identifier.
- **`tool_repository`**: The tool repository implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---

### Function register_tool_search_strategy(strategy_type: str, strategy: [Serializer](./../interfaces/serializer.md#serializer)[[ToolSearchStrategy](./../interfaces/tool_search_strategy.md#toolsearchstrategy)], override: bool) -> bool {#register_tool_search_strategy}

<details>
<summary>Documentation</summary>

Register a tool search strategy implementation.


**Args**

- **`strategy_type`**: The tool search strategy type identifier.
- **`strategy`**: The tool search strategy implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---

### Function register_tool_post_processor(tool_post_processor_type: str, tool_post_processor: [Serializer](./../interfaces/serializer.md#serializer)[[ToolPostProcessor](./../interfaces/tool_post_processor.md#toolpostprocessor)], override: bool) -> bool {#register_tool_post_processor}

<details>
<summary>Documentation</summary>

Register a tool post processor implementation.


**Args**

- **`tool_post_processor_type`**: The tool post processor type identifier.
- **`tool_post_processor`**: The tool post processor implementation.
- **`override`**: Whether to override an existing implementation.



**Returns**

True if the implementation was registered, False otherwise.
</details>

---
