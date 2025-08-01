---
id: tool-repository
title: Tool Repositories
sidebar_position: 1
---

# Tool Repositories

The `ToolRepository` is a key component of the `UtcpClient` responsible for storing, managing, and retrieving discovered tools and their associated providers.

## The Role of a Tool Repository

When you register a manual provider with the client, the client fetches the `UTCPManual` and uses the `ToolRepository` to save all the discovered tools. When you later call a tool, the client queries the repository to find the tool's definition and its `tool_provider` configuration.

This abstraction allows you to control how and where tools are stored. You can use the default in-memory repository for simplicity or implement a custom repository for more advanced use cases like persistent storage.

## Default Implementation: `InMemToolRepository`

By default, the `UtcpClient` uses the `InMemToolRepository`, which stores all tools and providers in memory. This is suitable for most applications, especially those where the client's lifecycle is short-lived.

**Characteristics:**
- **Simple**: No external dependencies or configuration required.
- **Fast**: All operations are performed in memory.
- **Volatile**: All discovered tools are lost when the client instance is destroyed.

## Creating a Custom Tool Repository

For scenarios requiring persistence, you can create your own repository by inheriting from the `ToolRepository` abstract base class and implementing its methods. This is useful if you want to cache discovered tools in a database, a file, or a distributed cache to avoid re-fetching them every time your application starts.

### Example: A Custom JSON File Repository

Here is a simplified example of a repository that persists tools to a local JSON file.

```python
import json
from typing import List, Dict, Optional
from utcp.shared.provider import Provider
from utcp.shared.tool import Tool
from utcp.client.tool_repository import ToolRepository

class JsonFileToolRepository(ToolRepository):
    def __init__(self, file_path: str):
        self.file_path = file_path
        self._data = self._load()

    def _load(self) -> Dict:
        try:
            with open(self.file_path, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {"providers": {}, "tools": []}

    def _save(self):
        with open(self.file_path, 'w') as f:
            json.dump(self._data, f, indent=2)

    async def save_provider_with_tools(self, provider: Provider, tools: List[Tool]):
        provider_name = provider.name
        self._data["providers"][provider_name] = provider.model_dump()
        # Ensure no duplicate tools are added
        existing_tool_names = {t['name'] for t in self._data['tools']}
        for tool in tools:
            if tool.name not in existing_tool_names:
                self._data["tools"].append(tool.model_dump())
        self._save()

    # ... implement other abstract methods (get_tool, get_providers, etc.) ...

```

### Using Your Custom Repository

You can then instruct the `UtcpClient` to use your custom repository during instantiation:

```python
from utcp.client import UtcpClient

# Instantiate your custom repository
json_repo = JsonFileToolRepository("my_tools.json")

# Pass it to the client
client = await UtcpClient.create(tool_repository=json_repo)

# Now, when you register providers, tools will be saved to 'my_tools.json'
await client.register_tool_provider(...)
```
