# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an Obsidian plugin that adds functionality to open the current file in Cursor IDE and jump to the cursor position. The plugin is written in TypeScript and uses the Obsidian API to integrate with the note-taking application.

## Architecture

-   **Main Plugin Class**: `OpenInCursorPlugin` extends Obsidian's `Plugin` class
-   **Settings System**: Uses Obsidian's data storage with `OpenInCursorSettings` interface
-   **Cross-Platform Support**: Auto-detects platform-specific Cursor executable paths
-   **Command Registration**: Registers hotkey (`Alt+Shift+0`) and command palette entry
-   **Settings UI**: Custom settings tab using Obsidian's `PluginSettingTab`

## Development Commands

```bash
# Development build with watch mode
npm run dev

# Production build with type checking
npm run build

# Version bump (updates manifest.json and versions.json)
npm run version

# Automated release (runs linting, formatting, version bump, commit, and push)
./release-patch.sh
```

## Project Structure

-   `main.ts` - Main plugin implementation with all core functionality
-   `manifest.json` - Plugin metadata for Obsidian
-   `package.json` - Node.js dependencies and scripts
-   `esbuild.config.mjs` - Build configuration for bundling
-   `version-bump.mjs` - Script to sync versions across files
-   `release-patch.sh` - Automated release workflow script
-   `tsconfig.json` - TypeScript compiler configuration

## Key Implementation Details

### File Path Resolution

The plugin uses `app.vault.adapter.getBasePath()` or `adapter.basePath` to resolve the full file path from Obsidian's vault-relative paths.

### Cursor Integration

-   Uses Node.js `execFile` to launch Cursor with `--goto` flag
-   Supports line and column positioning: `cursor --goto file.md:line:column`
-   Platform-specific executable paths:
    -   macOS: `/Applications/Cursor.app/Contents/Resources/app/bin/cursor`
    -   Windows/Linux: `cursor` (assumes PATH)

### Settings Management

-   Auto-detects Cursor command on plugin load
-   Persistent settings storage through Obsidian's data system
-   Settings validation with connection testing

## Build System

-   **esbuild**: Fast TypeScript bundling with external Obsidian dependencies
-   **Target**: ES2018 with CommonJS output
-   **Development**: Inline sourcemaps and watch mode
-   **Production**: Minified output without sourcemaps

## Release Process

The `release-patch.sh` script automates:

1. Git status verification
2. ESLint and TypeScript checks
3. Version bump (patch level)
4. Prettier formatting
5. Git commit and tagging
6. Remote repository push
