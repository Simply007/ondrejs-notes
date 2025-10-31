# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Keep-inspired note-taking application built with React, TypeScript, and Vite. It showcases different rich text editor implementations (CKEditor 5, TipTap, and basic TextArea) in a single application. Notes are stored in browser localStorage.

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production (compiles TypeScript and builds with Vite)
npm run build

# Lint the codebase
npm run lint

# Preview production build locally
npm run preview
```

## Environment Setup

The application requires environment variables for premium CKEditor features:

- `VITE_AI_API_KEY` - OpenAI API key for CKEditor AI Assistant
- `VITE_CK_EDITOR_LICENSE_KEY` - CKEditor premium license key
- `VITE_CLOUD_SERVICE_TOKEN_URL` - CKEditor Cloud Services token URL
- `VITE_CLOUD_SERVICES_WEBSOCKET_URL` - CKEditor Cloud Services WebSocket URL for real-time collaboration

Note: The app will alert if required environment variables are missing but will still run (with limited functionality for premium features).

## Architecture

### Core Components Structure

**App.tsx**: Root component using React Router with two routes:
- `/` - Lists all notes (NotesList component)
- `/note/:id` - Detail view for editing a single note (NoteDetail component)

**NotesList.tsx**: Displays all notes as tiles with:
- Create new note functionality
- Delete note with confirmation
- Click to navigate to detail view

**NoteDetail.tsx**: Note editing interface with:
- Title input (max 200 chars)
- Rich text editor selection via RichText component
- Back navigation
- Timestamps (created/modified)
- Auto-save on every change via handleChange

### Rich Text Editor Architecture

**RichText.tsx**: Wrapper component that provides editor selection between three implementations:
1. **CKEditorArea** - Full-featured CKEditor 5 with premium features (AI Assistant, real-time collaboration, revision history, PDF export)
2. **TipTapArea** - TipTap editor with extensive formatting options
3. **TextArea** - Basic HTML textarea fallback

All three editors share the same props interface: `documentId`, `content`, `onChange`.

### CKEditor Integration Details

**CKEditorArea.tsx** implements:
- Cloud-based CKEditor 5 (version 45.1.0) loaded via `useCKEditorCloud`
- Real-time collaborative editing using Cloud Services with `documentId` as channel ID
- Conflict resolution modal when local content differs from collaborative content
- Revision history with separate viewer UI
- Premium features: AI Assistant (OpenAI), Format Painter, Multi-level Lists, Export to PDF
- Custom HTML support for TipTap compatibility (YouTube videos, code blocks, mentions)

**Important**: CKEditor's `initialData` is set from content prop, but collaborative content may differ. The component detects conflicts on editor ready and prompts user to resolve.

### TipTap Integration Details

**TipTapArea.tsx** implements:
- Local-only TipTap editor (no real-time collaboration in this implementation)
- Extensive extensions: formatting, lists, tables, images, YouTube embeds, mentions
- Custom MenuBar component with active state indicators
- Character count limit of 2000
- HTML output format (compatible with CKEditor's htmlSupport configuration)

### Data Persistence

**utils.ts** provides localStorage abstraction:
- `getNotes()` - Retrieves all notes from localStorage
- `saveNotes(notes)` - Saves notes array to localStorage
- `generateGUID()` - Creates unique IDs for new notes
- Storage key: `'notes'`

**Note type** (types.d.ts):
```typescript
{
  guid: string
  title: string  // max 200 chars
  content: string  // HTML string
  created: number  // timestamp
  modified: number  // timestamp
}
```

## Key Implementation Patterns

### Editor Switching
When switching between editors in RichText component, all editors receive the same HTML content. CKEditor and TipTap both work with HTML, enabling some level of compatibility. However, editor-specific features may not perfectly translate.

### Shared Document IDs
CKEditor uses `documentId` for collaborative channels. When users navigate to `/note/:id`, if the note doesn't exist locally but exists in CKEditor Cloud Services, NoteDetail creates a shell note with `[SHARED]` prefix, allowing collaborative editing of remote documents.

### Auto-save Pattern
Every change triggers immediate save to localStorage via `handleChange` in NoteDetail. No manual save button is needed.

## TypeScript Configuration

Project uses TypeScript with project references:
- `tsconfig.json` - Root configuration
- `tsconfig.app.json` - Application code configuration
- `tsconfig.node.json` - Node/Vite configuration

## Styling

Each component has its own CSS file imported directly. Main styles in `App.css` and `index.css`.

## Known Issues

- `App.tsx` contains duplicate error comments about 'dotenv' (lines 17-18) - these should be removed
- CKEditor conflict resolution replaces content globally rather than offering merge options
- No automated tests are configured in this project
