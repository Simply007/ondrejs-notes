# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based note-taking application inspired by Google Keep, featuring multiple rich-text editor options (CKEditor 5, Tiptap, plain TextArea). Notes are stored in browser localStorage and can be edited with various formatting features.

## Development Commands

```bash
# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Type check
tsc -b

# Lint the code
npm run lint

# Preview production build
npm run preview
```

## Environment Variables

Copy `.env.template` to `.env` and configure:

- `VITE_AI_API_KEY` - OpenAI API key for CKEditor AI Assistant
- `VITE_CK_EDITOR_LICENSE_KEY` - CKEditor license key
- `VITE_CLOUD_SERVICES_WEBSOCKET_URL` - CKEditor Cloud Services WebSocket URL
- `VITE_CLOUD_SERVICE_TOKEN_URL` - CKEditor Cloud Services token URL

**Important:** The app will start without these variables, but CKEditor premium features (AI Assistant, real-time collaboration, PDF export) will not work.

## Architecture

### Data Flow

1. **Storage Layer** (`src/utils.ts`): All notes are persisted in browser localStorage using the key `'notes'`. Helper functions `getNotes()`, `saveNotes()`, and `getNoteById()` manage data access.

2. **Routing** (`src/App.tsx`): Uses React Router with two routes:
   - `/` - Notes list view
   - `/note/:id` - Individual note editor view

3. **Note Structure** (`src/types.d.ts`):
   ```typescript
   type Note = {
     guid: string;
     title: string; // max 200 chars
     content: string; // Tiptap content (HTML)
     ckEditorContent?: string; // CKEditor migrated content (optional)
     created: number; // timestamp
     modified: number; // timestamp
   }
   ```

### Component Architecture

**NotesList** (`src/NotesList.tsx`):
- Displays all notes as tiles
- Creates new notes with `generateGUID()`
- Handles note deletion with confirmation
- New notes are added to the beginning of the list

**NoteDetail** (`src/NoteDetail.tsx`):
- Loads note by ID from URL params
- If note doesn't exist locally but has an ID, creates a new note (for collaborative sharing)
- Updates are saved to correct field based on selected editor and migration state
- Title is limited to 200 characters
- Shows "Migrate to CKEditor" button for non-migrated notes
- Manages `selectedEditor` state to track which editor is active

**RichText** (`src/components/RichText.tsx`):
- **Non-migrated notes**: Shows Tiptap editor only (no dropdown selector)
- **Migrated notes**: Shows dropdown with Tiptap (read-only) and CKEditor options
- Displays warning banner when viewing Tiptap version of migrated notes
- Acts as abstraction layer between note editing and specific editor implementations

### Editor Implementations

**CKEditorArea** (`src/components/CKEditorArea.tsx`):
- Uses CKEditor 5 Classic Editor style loaded from CDN via `@ckeditor/ckeditor5-react`
- Features: Rich formatting, AI Assistant, PDF Export, Real-time Collaboration, Revision History
- Handles collaborative editing conflicts with a modal dialog
- Configuration generated via CKEditor Builder, heavily customized with 30+ plugins
- Requires environment variables for premium features
- Uses `channelId: documentId` for real-time collaboration sessions

**TiptapArea** (`src/components/TiptapArea.tsx`):
- Uses Tiptap React editor with extensive extension list
- **Default editor** for all new notes
- Supports `readOnly` prop for displaying migrated notes in read-only mode
- Custom MenuBar component with toolbar buttons (hidden in read-only mode)
- Uses `useEditorState` hook for reactive button states
- Supports all major formatting (headings, lists, tables, code blocks, media embeds)
- Includes YouTube embed and Mention extensions
- Character count limited to 2000 characters

## Key Implementation Details

### Tiptap-First Architecture
- **Default editor**: All new notes use Tiptap by default
- **No editor selector**: Non-migrated notes show Tiptap only (no dropdown)
- **Migration is optional**: Users can migrate individual notes to CKEditor via "Migrate to CKEditor" button
- **Backward compatible**: Existing notes continue working with their original editor

### Migration Flow
When user clicks "Migrate to CKEditor" button:
1. Confirmation dialog asks user to confirm migration
2. Copies `content` (Tiptap HTML) to new `ckEditorContent` field
3. Original `content` field remains unchanged (preserved for read-only Tiptap view)
4. Saves updated note to localStorage
5. Switches view to CKEditor with migrated content
6. Migration button disappears (cannot be undone)

**Migrated note behavior**:
- Dropdown appears with two options: "Tiptap (Original - Read Only)" and "CKEditor"
- Tiptap view: Shows warning banner + read-only original content with MenuBar hidden
- CKEditor view: Fully editable migrated content
- All edits save to `ckEditorContent` field, original `content` never changes

### Real-time Collaboration (CKEditor)
- Uses CKEditor Cloud Services for WebSocket-based collaboration
- Multiple users can edit the same note by sharing the note URL (note ID becomes the channel ID)
- Conflict resolution: When local content differs from collaborative content, shows modal asking user to choose version
- Presence list shows active collaborators
- Revision history tracks all changes with timestamps

### HTML Compatibility Between Editors
- CKEditor uses GHS (General HTML Support) to preserve Tiptap-specific HTML (CKEditorArea.tsx:354-372)
- Allows content created in Tiptap to be edited in CKEditor without data loss
- Supports custom attributes like `data-youtube-video`, `data-color`, custom classes

### Shared Note Creation Flow
When accessing `/note/:id` for a non-existent note:
1. Creates new note with the provided ID
2. Sets title to `[SHARED] New note`
3. Leaves content empty (loaded from CKEditor server if collaborative)
4. Saves to localStorage

## Branch Context

Current branch: `stale/migrate-from-tiptap`
- Migration from multi-editor selector to Tiptap-first architecture is complete
- Tiptap is now the default editor for all new notes
- CKEditor is available as opt-in migration per note
- The RichText component handles both migrated and non-migrated states

## Tech Stack

- React 19 with TypeScript
- Vite 6 (build tool)
- React Router 6 (routing)
- CKEditor 5 (primary rich text editor)
- Tiptap 3 (alternative rich text editor)
- ESLint 9 (linting)
