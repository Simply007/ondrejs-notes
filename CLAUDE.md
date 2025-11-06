# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Google Keep-inspired note-taking application built with React, TypeScript, and Vite. It showcases different rich text editor implementations (CKEditor 5, TipTap, and basic TextArea) in a single application. Notes are stored in browser localStorage.

## Development Commands

```bash
# Install dependencies
npm install

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

Copy `.env.template` to `.env` and configure:

```bash
cp .env.template .env
```

Required environment variables for premium CKEditor features:

- `VITE_AI_API_KEY` - OpenAI API key from https://platform.openai.com/api-keys (for AI Assistant)
- `VITE_CK_EDITOR_LICENSE_KEY` - CKEditor premium license from https://portal.ckeditor.com
- `VITE_CLOUD_SERVICE_TOKEN_URL` - CKEditor Cloud Services token URL
- `VITE_CLOUD_SERVICES_WEBSOCKET_URL` - CKEditor Cloud Services WebSocket URL

The app will alert if environment variables are missing but will still run with limited functionality. Only CKEditor premium features require these variables; TipTap and TextArea editors work without configuration.

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
- Cloud-based CKEditor 5 (version 45.1.0) loaded via `useCKEditorCloud` hook
- Real-time collaborative editing using Cloud Services with `documentId` as channel ID
- Conflict resolution modal when local content differs from collaborative content (lines 469-523)
- Revision history with separate viewer UI (refs: editorRevisionHistoryRef, editorRevisionHistoryEditorRef, editorRevisionHistorySidebarRef)
- Premium features: AI Assistant (OpenAI), Format Painter, Multi-level Lists, Export to PDF
- Custom HTML support for TipTap compatibility via `GeneralHtmlSupport` plugin (lines 389-407)
- Custom plugin `SupportTiptapMention` (lines 148-180) for upcast conversion of TipTap mention syntax

**Important collision handling**: CKEditor's `initialData` is set from the `content` prop, but collaborative content from the server may differ. The component detects conflicts in the `onReady` handler (lines 531-539) and displays a modal for conflict resolution.

### TipTap Integration Details

**TipTapArea.tsx** implements:
- Local-only TipTap editor (no real-time collaboration in this implementation)
- Extensive extensions: formatting, lists, tables, images, YouTube embeds, mentions (lines 264-296)
- Custom MenuBar component with `useEditorState` hook for reactive active state indicators (lines 46-252)
- Character count limit of 2000 characters
- HTML output format via `getHTML()` method (compatible with CKEditor's htmlSupport configuration)

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
When switching between editors in RichText component (via dropdown selector at line 28), all editors receive the same HTML content. CKEditor and TipTap both work with HTML, enabling some level of compatibility. However, editor-specific features may not perfectly translate between editors.

### Shared Document IDs for Collaboration
CKEditor uses `documentId` for collaborative channels. When users navigate to `/note/:id`:
- If the note exists locally, it's loaded from localStorage
- If the note doesn't exist locally, NoteDetail creates a shell note with `[SHARED]` prefix (NoteDetail.tsx:18-29)
- This allows collaborative editing where multiple users can share a note by navigating to the same URL path

### Auto-save Pattern
Every change triggers immediate save to localStorage via `handleChange` in NoteDetail (lines 35-52). The pattern:
1. Update local state with new content
2. Update modified timestamp
3. Check if note exists in localStorage
4. Either update existing note or add new note to array
5. Save entire notes array back to localStorage

No manual save button is needed.

## TypeScript Configuration

Project uses TypeScript with project references:
- `tsconfig.json` - Root configuration
- `tsconfig.app.json` - Application code configuration
- `tsconfig.node.json` - Node/Vite configuration

## Styling

Each component has its own CSS file imported directly. Main styles in `App.css` and `index.css`.

## Important Implementation Notes

### CKEditor Custom Plugin Pattern
When extending CKEditor functionality, use the Plugin base class pattern shown in `SupportTiptapMention` (CKEditorArea.tsx:148-180). The plugin's `init()` method accesses the editor instance via `this.editor` and can register custom conversions for upcast/downcast.

### Editor Props Interface
All three editor implementations must accept the same props:
- `documentId: string` - Unique identifier (used for CKEditor collaboration channel)
- `content: string` - Initial HTML content
- `onChange: (newContent: string) => void` - Callback when content changes

### Ref Management in CKEditor
CKEditorArea uses multiple refs for different UI sections:
- `editorPresenceRef` - Container for presence list (who's editing)
- `editorContainerRef` - Main editor container
- `editorRef` - Editor instance wrapper
- `editorRevisionHistory*` refs - Revision history UI components

These must be initialized and passed to editor config before rendering.

## Known Issues

- `App.tsx` contains duplicate error comments about 'dotenv' (lines 17-18) - these should be removed
- CKEditor conflict resolution replaces content globally rather than offering merge options
- No automated tests are configured in this project
- TipTap's heading extension is configured for levels 1-3 (line 268) but MenuBar shows buttons for H1-H6
