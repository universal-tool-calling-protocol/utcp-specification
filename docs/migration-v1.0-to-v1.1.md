---
id: migration-v1.0-to-v1.1
title: Migration Guide - v1.0 to v1.1
sidebar_position: 8
---

# Migration Guide: v1.0 to v1.1

This guide covers the changes in UTCP v1.1 and what you need to update.

## Overview

UTCP v1.1 introduces **secure-by-default protocol restrictions** for manuals. This is a non-breaking change for most users, but you may need to update your configuration if you use multi-protocol manuals.

## What Changed

### New Field: `allowed_communication_protocols`

A new optional field `allowed_communication_protocols` has been added to all call templates (manual configurations).

**Default Behavior (Secure by Default)**:
- If not specified, a manual can **only** register and call tools that use its own protocol type
- An HTTP manual can only use HTTP tools
- A CLI manual can only use CLI tools

**Custom Behavior**:
- Set `allowed_communication_protocols` to explicitly allow multiple protocol types

## Do I Need to Change Anything?

### No Changes Needed If:
- Your manuals only contain tools using the same protocol as the manual itself
- Example: HTTP manual with only HTTP tools ✅

### Changes Required If:
- Your manual contains tools that use **different protocols** than the manual's call template
- Example: HTTP manual that also registers CLI tools ❌ (will be filtered out in v1.1)

## Migration Steps

### Step 1: Check Your Manuals

Review your UTCP manuals to see if any contain tools with mixed protocol types.

### Step 2: Add `allowed_communication_protocols` If Needed

If you have a manual that needs to support multiple protocols, add the field to your manual call template configuration:

**Before (v1.0)**:
```json
{
  "manual_call_templates": [
    {
      "name": "my_tools",
      "call_template_type": "http",
      "url": "https://api.example.com/utcp"
    }
  ]
}
```

**After (v1.1)** - To allow both HTTP and CLI tools:
```json
{
  "manual_call_templates": [
    {
      "name": "my_tools",
      "call_template_type": "http",
      "url": "https://api.example.com/utcp",
      "allowed_communication_protocols": ["http", "cli"]
    }
  ]
}
```

### YAML Configuration

```yaml
manual_call_templates:
  - name: my_tools
    call_template_type: http
    url: https://api.example.com/utcp
    allowed_communication_protocols:
      - http
      - cli
```

## Behavior Details

| `allowed_communication_protocols` Value | Behavior |
|----------------------------------------|----------|
| Not set / `undefined` | Only allows manual's own protocol |
| Empty array `[]` | Only allows manual's own protocol |
| `["http"]` | Only allows HTTP tools |
| `["http", "cli"]` | Allows HTTP and CLI tools |
| `["http", "cli", "mcp"]` | Allows HTTP, CLI, and MCP tools |

## Warning Messages

If a tool is filtered out during registration, you'll see a warning:

```
Warning: Tool 'tool_name' uses communication protocol 'cli' which is not in 
allowed protocols ['http'] for manual 'manual_name'. Tool will not be registered.
```

If you attempt to call a tool with a disallowed protocol:

```
Error: Tool 'manual_name.tool_name' uses communication protocol 'cli' which is 
not allowed by manual 'manual_name'. Allowed protocols: ['http']
```

## Why This Change?

This change improves security by ensuring manuals can only execute tools using protocols they explicitly allow. This prevents unexpected behavior where a seemingly HTTP-only manual could execute CLI commands.

## Summary

| Scenario | Action Required |
|----------|-----------------|
| Single-protocol manuals | None |
| Multi-protocol manuals | Add `allowed_communication_protocols` field |

For most users, no changes are required. The new default behavior is more secure and won't affect typical single-protocol setups.
