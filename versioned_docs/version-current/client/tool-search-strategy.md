---
sidebar_position: 1
---




---
sidebar_position: 1
---

# Tool Search Strategies

The `ToolSearchStrategy` is a component of the `UtcpClient` that allows you to control how tools are searched and ranked based on a query. This is particularly useful for AI agents that need to find the most relevant tool for a given task.

## The Role of a Tool Search Strategy

When you call `client.search_tools(query)`, the client delegates the search operation to the configured `ToolSearchStrategy`. The strategy's job is to take the search query, compare it against the tools available in the `ToolRepository`, and return a ranked list of the most relevant `Tool` objects.

This abstraction enables you to implement sophisticated search algorithms tailored to your specific needs, such as keyword matching, semantic search, or even AI-powered ranking.

## Default Implementation: `TagSearchStrategy`

The `UtcpClient` comes with a default search strategy called `TagSearchStrategy`. This strategy scores tools based on a simple but effective algorithm:

1.  It tokenizes the search query into individual words.
2.  It compares these words against each tool's `tags` and `description`.
3.  Matches with `tags` are given a higher weight than matches with the `description`.
4.  Tools are ranked by their total score and returned to the caller.

This provides a good baseline for tool discovery without requiring complex setup.

## Creating a Custom Tool Search Strategy

You can implement a custom search strategy by inheriting from the `ToolSearchStrategy` abstract base class and implementing the `search_tools` method. This allows you to integrate with more advanced search technologies, such as vector databases or full-text search engines.

### Example: A Custom Semantic Search Strategy

Here is a conceptual example of a strategy that uses a sentence transformer model to perform semantic search. This would require a library like `sentence-transformers`.

```python
from typing import List
from utcp.shared.tool import Tool
from utcp.client.tool_repository import ToolRepository
from utcp.client.tool_search_strategy import ToolSearchStrategy
from sentence_transformers import SentenceTransformer, util

class SemanticSearchStrategy(ToolSearchStrategy):
    def __init__(self, tool_repository: ToolRepository):
        self.tool_repository = tool_repository
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    async def search_tools(self, query: str, limit: int = 10) -> List[Tool]:
        tools = await self.tool_repository.get_tools()
        if not tools:
            return []

        # Create embeddings for the query and all tool descriptions
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        tool_descriptions = [tool.description for tool in tools]
        description_embeddings = self.model.encode(tool_descriptions, convert_to_tensor=True)

        # Compute cosine similarity between the query and all descriptions
        cosine_scores = util.cos_sim(query_embedding, description_embeddings)[0]

        # Rank tools based on similarity scores
        top_results = sorted(zip(cosine_scores, tools), key=lambda x: x[0], reverse=True)

        # Return the top N tools
        return [tool for score, tool in top_results[:limit]]

```

### Using Your Custom Search Strategy

You can configure the `UtcpClient` to use your custom strategy during instantiation:

```python
from utcp.client import UtcpClient

# Instantiate your custom strategy
semantic_search = SemanticSearchStrategy(client.tool_repository)

# Pass it to the client
client = await UtcpClient.create(search_strategy=semantic_search)

# Now, client.search_tools() will use your semantic search logic
relevant_tools = await client.search_tools("Find a way to send a message to a user")
```
