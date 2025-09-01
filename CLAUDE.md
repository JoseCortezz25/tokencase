# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Figma plugin called "TokenCase" that exports local styles (design tokens) from Figma to various CSS formats and preprocessors. The plugin allows users to select nodes that use design tokens, visualize them in the UI, and export them in different naming conventions and formats.

## Plugin Functionality

### Core Features
1. **Token Detection**: When users select nodes in Figma, the plugin extracts and displays the local styles (colors, typography, effects, etc.) used by those nodes
2. **Naming Convention Options**: Users can choose export format:
   - kebab-case
   - camelCase  
   - snake_case
   - PascalCase
3. **Export Formats**: Support for multiple output formats:
   - CSS custom properties
   - Tailwind CSS configuration
   - SCSS/Sass variables
   - CSS-in-JS objects
4. **Export Methods**: 
   - Copy to clipboard
   - Download as file

### UI Structure
- **Token Visualization**: Display selected tokens with preview
- **Naming Convention Selector**: Dropdown/radio buttons for case conversion
- **Format Selector**: Choose between CSS, Tailwind, SCSS, etc.
- **Export Actions**: Copy and download buttons

## Architecture

### Dual-Context Architecture
The plugin operates in two separate contexts:
- **Plugin Side** (`src/plugin/`): Runs in Figma's plugin sandbox with access to Figma API
- **UI Side** (`src/ui/`): React UI that renders in an iframe within Figma
- **Common** (`src/common/`): Shared code and network event definitions

### Communication System
Uses `monorepo-networker` for type-safe communication:
- Event definitions in `src/common/networkSides.ts`
- Plugin-side handlers in `src/plugin/plugin.network.ts`
- UI-side handlers in `src/ui/app.network.tsx`

### Key Data Flow
1. User selects nodes in Figma
2. Plugin side extracts local styles from selection
3. Styles are sent to UI via network events
4. UI displays tokens and export options
5. User configures naming and format preferences
6. UI requests formatted output from plugin side
7. Plugin processes and returns formatted tokens
8. UI enables copy/download functionality

### Build System
- Dual Vite configs: `vite.config.plugin.ts` (plugin) and `vite.config.ui.ts` (UI)
- Bundles everything into single files as required by Figma
- SVG imports support: `?component`, `?url`, `?raw`

## Development Commands

```bash
# Start development with hot reload
npm run dev

# Develop UI only (browser mode, no Figma context)
npm run dev:ui-only

# Build for production
npm run build

# Type checking
npm run types

# Linting and formatting
npm run lint
npm run format
```

## Key Development Notes

1. **Plugin Manifest**: Configure plugin details in `figma.manifest.ts`, not directly in manifest.json
2. **Asset Imports**: SVG files can be imported as React components with `?component` suffix
3. **Hot Reload**: Enable "Hot reload plugin" in Figma settings for automatic reloading during development
4. **Network Events**: All communication between plugin and UI must be declared in `src/common/networkSides.ts`
5. **Figma API**: Use `figma.getLocalPaintStyles()`, `figma.getLocalTextStyles()`, etc. for accessing local styles
6. **Selection Handling**: Listen to `figma.currentPage.selection` changes to detect user selections

## File Structure

- `src/plugin/plugin.ts` - Main plugin entry point and Figma API interactions
- `src/ui/main.tsx` - React app entry point
- `src/ui/app.tsx` - Main UI component with token visualization and export options
- `src/common/networkSides.ts` - Communication layer definitions for token data
- `figma.manifest.ts` - Plugin configuration
- `dist/` - Built files ready for Figma (created after build)

## Development Priorities

When implementing new features, focus on:
1. Robust token extraction from Figma selections
2. Accurate case conversion utilities
3. Format-specific token serialization
4. Clipboard and file download functionality
5. User-friendly preview of extracted tokens