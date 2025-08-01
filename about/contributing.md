---
title: Contributing to UTCP
id: contributing
sidebar_position: 3
---
# Contributing to UTCP Organization Repositories

Welcome to the Universal Tool Calling Protocol (UTCP) organization! We're excited to have you contribute to our mission of creating efficient, decentralized, and scalable AI tool integration. This document serves as the unified contribution guideline for all repositories in our organization.

## Core Requirements

Our development follows the fundamental UTCP requirements:

- **No wrapper tax**: Solutions must work with existing tools without requiring changes
- **No security tax**: Maintain the same security guarantees as human interaction
- **Scalable**: Handle large numbers of tools and calls efficiently
- **Simple**: Keep implementation and usage straightforward

> **Core Principle**: If humans can interact with an API, AI should be able to do the same with no change in the API and the same security guarantees.

## Development Workflow

### Git Workflow

We follow a **Gitflow release model** with the following branch structure:

```
main (production-ready releases)
  ↑
dev (integration branch)
  ↑
feature/fix branches
```

**Branch Flow:**
1. **Development** → All changes go into the `dev` branch first
2. **Integration** → `dev` is merged into `main` for releases
3. **Versioning** → `main` creates version-specific branches, with major and minor versioning (e.g., `v1.0`, `v2.1`)

**Working with Branches:**
- Create feature branches from `dev`: `git checkout -b feature/your-feature-name dev`
- Create bug fix branches from `dev`: `git checkout -b fix/issue-description dev`
- Submit PRs to the `dev` branch
- Only release managers merge `dev` → `main` → version branches

### Pull Request Process

1. **Fork and Branch**: Fork the repository and create a feature branch from `dev`
2. **Develop**: Make your changes following our architectural guidelines
3. **Test**: Ensure all tests pass and add new tests for your changes
4. **Document**: Update documentation if your changes affect public APIs
5. **Submit**: Open a PR against the `dev` branch with a clear description
6. **Review**: Address feedback from maintainers
7. **Merge**: Once approved, your PR will be merged by a maintainer

## Architecture Guidelines

Our codebase follows a **dependency injection-based architecture** with clear separation of concerns:

### Core Architectural Principles

#### 1. Dependency Injection First
- Use constructor injection for dependencies
- Favor composition over inheritance
- Make dependencies explicit through interfaces
- Enable easy testing through mock implementations

```python
# Good - Dependency injection
class ToolClient:
    def __init__(self, repository: ToolRepository, search_strategy: ToolSearchStrategy):
        self._repository = repository
        self._search_strategy = search_strategy

# Avoid - Direct instantiation
class ToolClient:
    def __init__(self):
        self._repository = FileSystemToolRepository()  # Hard dependency
```

#### 2. Discourage Subclassing for Non-Data Types
- Prefer composition and interfaces over inheritance for business logic
- Subclassing is acceptable for data types and value objects
- Use protocols/interfaces to define contracts

```python
# Good - Interface-based design
from abc import ABC, abstractmethod

class ToolSearchStrategy(ABC):
    @abstractmethod
    def search(self, query: str) -> List[Tool]:
        pass

class SemanticSearchStrategy(ToolSearchStrategy):
    def search(self, query: str) -> List[Tool]:
        # Implementation
        pass

# Acceptable - Data type subclassing
class HttpTool(Tool):
    def __init__(self, endpoint: str, method: str):
        super().__init__()
        self.endpoint = endpoint
        self.method = method
```

#### 3. Separate Data and Logic
- **Data classes**: Pure data containers with minimal behavior
- **Logic classes**: Business logic with clear responsibilities
- Avoid mixing data storage with business logic

```python
# Data class - Pure data container
@dataclass
class ToolDefinition:
    name: str
    description: str
    parameters: Dict[str, Any]
    endpoint: str

# Logic class - Business behavior
class ToolInvoker:
    def __init__(self, http_client: HttpClient):
        self._http_client = http_client
    
    def invoke(self, tool: ToolDefinition, params: Dict[str, Any]) -> Any:
        # Business logic implementation
        pass
```

#### 4. Interface-First Design
- Define interfaces before implementations
- Document business logic through interface contracts
- Enable multiple implementations for flexibility

```python
# 1. Define interface first
class ToolRepository(ABC):
    """Repository for storing and retrieving tool definitions.
    
    Supports scalable storage backends for enterprise use cases.
    """
    
    @abstractmethod
    def store(self, tool: ToolDefinition) -> None:
        """Store a tool definition."""
        pass
    
    @abstractmethod
    def retrieve(self, tool_id: str) -> Optional[ToolDefinition]:
        """Retrieve a tool by ID."""
        pass
    
    @abstractmethod
    def search(self, criteria: SearchCriteria) -> List[ToolDefinition]:
        """Search for tools matching criteria."""
        pass

# 2. Implement the interface
class DatabaseToolRepository(ToolRepository):
    def store(self, tool: ToolDefinition) -> None:
        # Database implementation
        pass
    
    # ... other implementations
```

## Testing Requirements

### Test Coverage for Source Code Changes

**All PRs that modify source code in the library must include appropriate tests:**

- **Unit Tests**: Test individual components in isolation
- **Integration Tests**: Test component interactions
- **Contract Tests**: Verify interface implementations
- **End-to-End Tests**: Test complete workflows

### Test Structure

```
tests/
├── unit/           # Fast, isolated tests
├── integration/    # Component interaction tests
├── e2e/           # End-to-end workflow tests
└── fixtures/      # Test data and mocks
```

### Test Quality Standards

- **Coverage**: Maintain minimum 80% code coverage for new code
- **Independence**: Tests must not depend on external services
- **Speed**: Unit tests should run in milliseconds
- **Clarity**: Test names should describe the scenario being tested

```python
# Good test structure
class TestToolInvoker:
    def test_invoke_with_valid_params_returns_success_response(self):
        # Arrange
        mock_client = Mock(spec=HttpClient)
        mock_client.post.return_value = {"status": "success"}
        invoker = ToolInvoker(mock_client)
        
        # Act
        result = invoker.invoke(sample_tool, {"param": "value"})
        
        # Assert
        assert result["status"] == "success"
        mock_client.post.assert_called_once()
```

## Code Quality Standards

### Code Style
- Follow language-specific style guides (PEP 8 for Python, etc.)
- Use consistent naming conventions
- Write self-documenting code with meaningful names
- Keep functions and classes focused on single responsibilities

### Documentation
- Document all public APIs with docstrings
- Include usage examples for complex functionality
- Update README files when adding new features

### Error Handling
- Use specific exception types
- Provide meaningful error messages
- Log errors with sufficient context
- Handle edge cases gracefully

## Scalability Considerations

Remember that UTCP is designed for enterprise-scale deployment:

- **Performance**: Design for high throughput and low latency
- **Concurrency**: Design thread-safe components!!!
- **Configuration**: Make components configurable for different deployment scenarios

## Community Guidelines

### Communication
- Be respectful and inclusive
- Ask questions in discussions or issues
- Provide context when reporting bugs
- Suggest improvements through issues before implementing

### Getting Help
- Check existing issues and discussions
- Read the documentation thoroughly
- Provide minimal reproducible examples
- Tag maintainers only when necessary

## Release Process

1. **Feature Freeze**: No new features in `dev` branch
2. **Testing**: Comprehensive testing of `dev` branch
3. **Documentation**: Update all relevant documentation
4. **Merge**: `dev` → `main` with release notes
5. **Tag**: Create version tag on `main`
6. **Branch**: Create version branch for maintenance
7. **Deploy**: Deployment from version branch

---

Thank you for contributing to UTCP! Your efforts help build a more efficient and scalable future for AI tool integration.

For questions about this guide, please open a discussion in the repository or contact the maintainers.
