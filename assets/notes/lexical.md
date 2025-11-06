# Lexical Notes

* Lexical: https://lexical.dev/
* Developed by Meta (Facebook)
* Designed as a successor to Draft.js
* Framework-agnostic core with React bindings via @lexical/react

## Implementation Experience

### Positive Aspects

* **Plugin Architecture**: Very clean and modular plugin system
  * Each feature is a separate plugin (HistoryPlugin, ListPlugin, LinkPlugin, etc.)
  * Easy to compose features you need
  * Plugins are just React components that hook into the editor
* **TypeScript Support**: Excellent TypeScript support out of the box
  * Well-typed APIs
  * Good IntelliSense experience
* **Command System**: Strong command-based architecture
  * Commands like `FORMAT_TEXT_COMMAND`, `INSERT_ORDERED_LIST_COMMAND`
  * Makes toolbar implementation predictable
  * Easy to dispatch commands from UI elements
* **State Management**: Built-in state management with `registerUpdateListener`
  * Clean way to sync editor state with external React state
  * Can read editor state reactively
* **HTML Import/Export**: Good support via `@lexical/html`
  * `$generateHtmlFromNodes` for export
  * `$generateNodesFromDOM` for import
  * Works well for interoperability with other editors
* **Performance**: Lightweight and fast
  * Smaller bundle size compared to CKEditor
  * No external CDN dependencies needed
* **Markdown Support**: Built-in markdown shortcuts via `MarkdownShortcutPlugin`
  * Type `**text**` for bold, `*text*` for italic, etc.
  * Uses transformers from `@lexical/markdown`

### Challenges & Considerations

* **UI Not Included**: You must build your own UI/toolbar
  * More initial setup compared to CKEditor
  * Similar to TipTap in this regard
  * Need to manage toolbar state manually (bold, italic, current block type, etc.)
* **Learning Curve**: Conceptual model requires understanding
  * Editor State vs DOM
  * Nodes and their lifecycle
  * Update transactions with `editor.update()`
  * Read operations with `editorState.read()`
* **Documentation**: Still evolving
  * Some advanced use cases not well documented
  * Community smaller than CKEditor or TipTap
  * Examples help but not as comprehensive as mature editors
* **Initial Content Loading**: Requires careful handling
  * Need separate plugin to load initial HTML content
  * Must use `$generateNodesFromDOM` in an update transaction
  * Can't just set `initialConfig.editorState` with HTML directly
* **State Synchronization**: Requires custom plugin for onChange
  * Need `OnChangePlugin` to convert editor state to HTML on every change
  * Not provided out of the box unlike some other editors
* **Toolbar State Management**: Manual effort required
  * Need to track formatting state (bold, italic, etc.) separately
  * Must subscribe to editor updates to keep toolbar in sync
  * More boilerplate compared to TipTap's `useEditorState` hook

### Comparison to Other Editors

**vs. CKEditor**:
- Lexical: Lighter, more customizable, requires more setup
- CKEditor: Full-featured, premium features available, larger bundle

**vs. TipTap**:
- Both require custom UI
- Lexical: Command-based, Meta backing, newer
- TipTap: ProseMirror-based, more mature ecosystem, better docs

**vs. TextArea**:
- Lexical: Rich text with structured content
- TextArea: Simple, no dependencies, raw HTML

## Integration Notes

* Works well with existing note format (HTML strings)
* Toolbar follows similar pattern to TipTap implementation
* CSS styling follows project conventions with lexical- prefix
* Supports all basic formatting: bold, italic, underline, strikethrough
* Supports headings (H1-H6), lists (ordered/unordered), quotes
* Includes undo/redo history out of the box
* The $functions feel weird in the implementation
* Still in 0.X version
* Build incompatible with Draft.js - it's predecessor - so there is a chance Meta doing this again

## Recommendations

* **Good for**: Projects that want lightweight editor with full control
* **Consider if**:
  - You want smaller bundle size than CKEditor
  - You need custom UI/UX for the editor
  - You're comfortable building toolbars from scratch
  - You prefer Meta's approach to editor architecture
* **Avoid if**:
  - You need ready-made UI components
  - You want minimal setup time
  - You need extensive third-party plugins
  - You need real-time collaboration (not built-in like CKEditor)

## Technical Details

* Core package: `lexical` (~50KB minified)
* React bindings: `@lexical/react`
* Feature plugins: `@lexical/rich-text`, `@lexical/list`, `@lexical/link`, etc.
* HTML support: `@lexical/html` for import/export
* Node system similar to ProseMirror but simpler
* Editor state is immutable and updates are transactional

## Future Improvements

* Could add more plugins:
  - Table support (@lexical/table)
  - Image support with upload
  - Mentions/autocomplete
  - Collaborative editing (would require CRDTs like Yjs)
* Could enhance toolbar:
  - Color picker for text/background
  - Font family selector
  - More formatting options
* Could add floating/bubble menu (like TipTap)
