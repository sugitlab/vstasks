# VsTasks Extension

A Visual Studio Code extension for managing tasks in Markdown files with Obsidian Tasks compatible features.

## Features

- Manage tasks in Markdown files (- [ ] format)
- Obsidian Tasks compatible query features
- Workspace-wide task searching
- Task filtering and sorting
- Task creation and completion tracking

## Requirements

- Visual Studio Code version 1.85.0 or higher

## Getting Started

1. Install the extension
2. Open a workspace containing Markdown files
3. Use the VsTasks sidebar to view and manage your tasks
4. Use the command palette (Ctrl+Shift+P or Cmd+Shift+P) and search for "VsTasks" to access commands

## Commands

- `VsTasks: Refresh Tasks` - Refresh the task list
- `VsTasks: Search Tasks` - Search for tasks across the workspace
- `VsTasks: Create New Task` - Create a new task
- `VsTasks: Toggle Task Status` - Toggle the status of a task
- `VsTasks: Run Task Query` - Run a custom query for tasks

## Extension Settings

This extension contributes the following settings:

* `vstasks.enableAutoRefresh`: Enable/disable automatic task refresh when files change
* `vstasks.refreshInterval`: Interval in seconds for automatic task refresh

## Release Notes

### 0.0.1

Initial release of VsTasks
