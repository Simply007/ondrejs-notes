# ProseMirror Notes

* ProseMirror: https://prosemirror.net/
* Toolkit for building rich text editors
* Created by Marijn Haverbeke (creator of CodeMirror and Acorn)
* First released in 2015
* Free and open-source (MIT license)
* Powers editors like TipTap, Atlassian products, The New York Times, and many more
* Philosophy: "A toolkit, not a turnkey solution"
* Used by major companies including GitHub, Atlassian, The Guardian, and more

## Core Philosophy

**Toolkit, Not Library**: ProseMirror is explicitly designed as a toolkit for building editors, not a ready-made editor component. Key principles:
- **Schema-driven**: Content structure defined by a schema, ensuring valid documents
- **Functional**: Immutable state transformations for predictability
- **Modular**: Core is split into separate, composable modules
- **Unopinionated**: No default UI - you build exactly what you need
- **Collaborative-ready**: Built-in support for real-time collaboration
- **Extensible**: Plugin system allows deep customization

This gives you complete control but requires understanding core concepts and building UI from scratch.

## Implementation Experience

### Positive Aspects

* **Rock-Solid Foundation**: Battle-tested architecture
  * Powers major production applications (Atlassian, NYT, GitHub)
  * Extremely stable and reliable core
  * Well-thought-out abstractions that stand the test of time
  * Handles edge cases that break other editors
* **Schema System**: Best-in-class content modeling
  * Define exactly what content is allowed
  * Prevents invalid document structures automatically
  * Type-safe document traversal
  * Makes collaborative editing robust
  * Clear separation between document model and view
* **Collaborative Editing**: First-class feature
  * Operational Transformation baked into core
  * Handles conflicts intelligently
  * Powers real-time collaboration in major products
  * Well-documented collaboration architecture
* **Excellent Documentation**: Comprehensive and well-written
  * Detailed guide walks through concepts systematically
  * Reference docs are thorough and accurate
  * Philosophy and architecture clearly explained
  * Examples demonstrate best practices
* **Transform System**: Powerful and elegant
  * All changes through immutable transformations
  * Enables undo/redo naturally
  * Makes change tracking straightforward
  * Clean API for programmatic edits
* **Plugin Architecture**: Flexible and composable
  * Plugins can add state, commands, key bindings, decorations
  * Clean separation of concerns
  * Easy to compose multiple plugins
  * Well-defined plugin API
* **TypeScript Support**: Good but not perfect
  * Core packages have TypeScript definitions
  * Schema typing requires manual declaration merging
  * Better than no types, less ergonomic than Slate
* **Mature Ecosystem**: Strong foundation for other tools
  * TipTap built on top of ProseMirror
  * Many community plugins and extensions
  * Proven patterns and examples
  * Active community with deep expertise

### Challenges & Considerations

* **Steep Learning Curve**: Most complex editor framework tested
  * Requires understanding schema, nodes, marks, transforms, selections, plugins
  * Conceptual model is sophisticated (rightfully so)
  * Documentation is excellent but dense
  * Takes time to internalize the mental model
  * More complex than Slate or Lexical
* **No Default UI**: Everything must be built
  * No toolbar out of the box
  * No default buttons or controls
  * More work than TipTap which wraps ProseMirror with UI
  * ~400+ lines of code for basic editor vs ~90 for Quill
* **Verbosity**: More boilerplate than alternatives
  * Commands require checking state and dispatching transactions
  * Button active states require traversing document
  * More code to achieve same result vs TipTap or Lexical
  * Schema definitions can be verbose
* **HTML Conversion**: Not as seamless as TipTap
  * Must use DOMParser/DOMSerializer manually
  * Handling edge cases in parsing requires care
  * More work than editors with built-in HTML support
  * TipTap (built on ProseMirror) handles this better
* **Not Beginner-Friendly**: Requires technical expertise
  * Best suited for experienced developers
  * Understanding the concepts takes dedication
  * Easier to use TipTap if you don't need full control
  * Overkill for simple rich text needs
* **Framework-Agnostic Tradeoff**: Power at cost of convenience
  * Works with any framework (or vanilla JS)
  * But requires more integration work than framework-specific editors
  * React bindings exist but aren't official
  * Lexical better for React-specific needs

## Key Features (As Implemented)

* **Text Formatting**: Basic mark types
  * Bold (strong)
  * Italic (em)
  * Inline code
* **Block Types**: Common block elements
  * Paragraphs
  * Headings (H1-H6)
  * Blockquotes
  * Code blocks
* **Lists**: Standard list support
  * Ordered (numbered) lists
  * Unordered (bulleted) lists
  * Tab/Shift+Tab for indent/outdent
  * Enter in empty list item to exit
* **Special Elements**:
  * Hard break (Shift+Enter)
  * Horizontal rule
* **History**: Undo/redo support
  * via `prosemirror-history` module
  * Standard undo/redo operations (Ctrl+Z/Ctrl+Y)
  * Transaction-based history
* **Keyboard Shortcuts**: Common shortcuts
  * Ctrl+B (bold), Ctrl+I (italic), Ctrl+` (code)
  * Tab/Shift+Tab (list indent/outdent)
  * Shift+Enter (hard break)
* **Toolbar**: Custom implementation
  * Text formatting buttons
  * Block type buttons
  * Active state indicators
  * Built from scratch (not included in ProseMirror)
* **Additional Plugins Used**:
  * `gapCursor`: Cursor placement between blocks
  * `dropCursor`: Visual indicator when dragging content
  * `keymap`: Keyboard shortcut handling
  * `baseKeymap`: Standard editing shortcuts

## Architecture

* **Schema**: Content structure definition
  * NodeSpec: Defines block and inline node types
  * MarkSpec: Defines text formatting marks
  * Nodes: paragraph, heading, blockquote, code_block, lists, etc.
  * Marks: strong, em, code
  * Schema validates document structure automatically
* **Document Model**: Tree of nodes
  * Node: Element with type, attributes, and content
  * Mark: Formatting applied to text ranges
  * Fragment: Sequence of nodes
  * Slice: Part of a document that can be inserted elsewhere
* **EditorState**: Immutable state object
  * doc: Current document
  * selection: Current selection/cursor position
  * storedMarks: Marks to apply to next typed character
  * plugins: Active plugins
  * Created via EditorState.create()
* **EditorView**: DOM representation and interaction
  * Renders state to DOM
  * Handles user input (keyboard, mouse)
  * Dispatches transactions to update state
  * Can be customized with props
* **Transactions**: State changes
  * Immutable transformations (like Redux actions)
  * Can be steps: insertText, replaceRange, etc.
  * Can be inspected, modified, or rejected
  * Applied to produce new state
* **Commands**: Functions that perform edits
  * Signature: (state, dispatch?) => boolean
  * Can query state without modifying (dispatch undefined)
  * Return true if command applies in current context
  * Used for toolbar buttons and keyboard shortcuts
* **Plugins**: Extend editor behavior
  * Can add state (plugin state)
  * Can add props (event handlers, decorations)
  * Can define key bindings
  * Can provide commands
  * Composable via array in EditorState.create()
* **Serialization**: Convert to/from HTML
  * DOMSerializer: ProseMirror doc → HTML DOM
  * DOMParser: HTML DOM → ProseMirror doc
  * Customizable per schema
  * Our implementation: serializeToHTML/deserializeFromHTML helpers

## Comparison with Other Editors

**vs CKEditor**:
- ProseMirror: Toolkit requiring custom build, maximum flexibility, framework-agnostic
- CKEditor: Complete solution, ready-made features, cloud services
- ProseMirror: More control, more work
- CKEditor: Faster implementation, less flexibility

**vs TinyMCE**:
- ProseMirror: Open-source toolkit, build everything yourself
- TinyMCE: Commercial complete editor with self-hosted option
- ProseMirror: Foundation for building custom experiences
- TinyMCE: Ready-made with many plugins

**vs Froala**:
- ProseMirror: Free toolkit, DIY approach, steep learning curve
- Froala: Commercial complete editor, fast setup
- ProseMirror: Used when you need something Froala can't provide
- Froala: Used when you want quick, polished editor

**vs TipTap**:
- TipTap: Built on top of ProseMirror (wraps it with better API)
- ProseMirror: Lower level, more verbose, full control
- TipTap: Higher level, easier API, good defaults, still extensible
- Choose TipTap unless you need to go deeper than TipTap allows
- TipTap is "ProseMirror made easier"

**vs Lexical**:
- Both: Modern, sophisticated editor frameworks
- ProseMirror: More mature (2015), schema-based, framework-agnostic
- Lexical: Newer (2022), React-first, Meta-backed, modern patterns
- ProseMirror: Battle-tested, proven at scale, extensive ecosystem
- Lexical: Cleaner API, better React integration, faster growing

**vs Slate**:
- Both: Framework-style editors requiring custom UI
- ProseMirror: Schema-based, framework-agnostic, more mature, steeper curve
- Slate: React-only, JSON-based, simpler core concepts (but still complex)
- ProseMirror: Better for collaboration, more robust validation
- Slate: Better for React apps, simpler data model

**vs Quill**:
- ProseMirror: Toolkit for custom editors, no UI, very flexible
- Quill: Complete editor with toolbar, quick setup, Delta format
- ProseMirror: When you need to build something specific
- Quill: When you want good editor fast

**vs TextArea**:
- ProseMirror: Sophisticated rich editor framework
- TextArea: Simple HTML input, no dependencies

## Pros

* Battle-tested foundation used in major production apps
* Schema system ensures document validity and consistency
* First-class collaborative editing support built-in
* Excellent, comprehensive documentation
* Powerful transform system for programmatic edits
* Flexible plugin architecture
* Framework-agnostic (works with React, Vue, Angular, vanilla JS)
* Immutable state makes debugging easier
* TypeScript definitions available
* Strong community and extensive ecosystem (TipTap, etc.)
* Free and open-source (MIT license)
* No vendor lock-in
* Handles edge cases that break simpler editors
* Proven at massive scale (Atlassian, GitHub, NYT)

## Cons

* Steepest learning curve of all editors (even more than Slate)
* No default UI whatsoever - must build everything
* Verbose API compared to higher-level alternatives
* More boilerplate code than TipTap or Lexical
* Not beginner-friendly - requires technical expertise
* Documentation is excellent but very dense
* Initial implementation takes significant time
* HTML parsing/serialization requires manual setup
* Less ergonomic TypeScript experience than Slate
* Overkill for simple rich text editing needs
* Better alternatives exist for quick implementations (TipTap wraps this!)

## Recommendations

* **Perfect for**:
  - Building highly specialized, custom editors
  - Applications requiring real-time collaboration
  - When you need schema-driven content validation
  - Building editor products (like TipTap did)
  - When you've outgrown simpler solutions
  - Complex document editing workflows
  - Applications where editor is core feature
  - When you need framework-agnostic solution

* **Consider if**:
  - You need collaborative editing features
  - You require strict content validation
  - Your team has strong technical skills
  - You need maximum control over behavior
  - You're building an editor-centric application
  - Long-term investment is acceptable
  - You need proven, battle-tested foundation
  - You want to build on top of it (like TipTap)

* **Avoid if**:
  - You need quick editor implementation (use TipTap instead!)
  - Team lacks technical expertise
  - Timeline is tight or budget is constrained
  - Standard editor features are sufficient (use Quill, CKEditor, TinyMCE)
  - You want ready-made UI (use literally anything else)
  - Editor is peripheral to your app
  - You prefer React-specific solutions (use Lexical)
  - You don't want to build UI from scratch

## Technical Details

* **Core packages**:
  * `prosemirror-state` - Editor state management
  * `prosemirror-view` - DOM rendering and interaction
  * `prosemirror-model` - Document model and schema
  * `prosemirror-schema-basic` - Basic schema definitions
  * `prosemirror-schema-list` - List node types
  * `prosemirror-keymap` - Keyboard shortcut handling
  * `prosemirror-history` - Undo/redo functionality
  * `prosemirror-commands` - Common editing commands
  * `prosemirror-inputrules` - Input rules (Markdown-like shortcuts)
  * `prosemirror-gapcursor` - Cursor between blocks
  * `prosemirror-dropcursor` - Visual drop indicator
* **Bundle size**:
  * Core modules: ~60-70KB minified and gzipped (all packages combined)
  * Modular: only import what you need
  * Comparable to Slate + dependencies
  * Larger than Lexical, smaller than commercial editors
* **License**: MIT (very permissive open source)
* **Framework support**:
  * Framework-agnostic: Works with any framework or vanilla JS
  * React: Community bindings available, or integrate manually
  * Vue: Community bindings available
  * Angular: Can be integrated
  * Official philosophy: not tied to any framework
* **Browser support**: Modern browsers (ES6+)
* **Updates**: Active development, regular releases, mature and stable
* **TypeScript**: TypeScript definitions included, schema typing requires work
* **Document Format**: JSON-serializable node tree
* **Customization**: Maximum (everything is customizable)
* **Real-time Collaboration**: Built-in support via prosemirror-collab

## Integration Notes

* **React Integration**: Manual but straightforward
  * Create EditorView in useEffect
  * Store view in ref
  * Destroy view on unmount
  * Use custom plugin for onChange callback
  * Build toolbar as separate React component
  * Track selection changes for button states
* **HTML Conversion**:
  * DOMParser.fromSchema(schema).parse(htmlElement) for import
  * DOMSerializer.fromSchema(schema).serializeFragment() for export
  * Create helper functions: deserializeFromHTML, serializeToHTML
  * Handle edge cases in parsing
* **Schema Definition**:
  * Start with prosemirror-schema-basic
  * Use addListNodes() to add list support
  * Create Schema instance with nodes and marks
  * Pass schema to EditorState.create()
* **Custom Plugin Pattern**:
  * Create plugin with state.init and state.apply
  * Implement view.update for onChange notifications
  * Return plugin from function for reusability
* **Toolbar Implementation**:
  * Separate component receiving EditorView
  * Check mark active: state.doc.rangeHasMark()
  * Check block active: iterate nodes with doc.nodesBetween()
  * Execute commands: command(state, view.dispatch)
  * Use onMouseDown instead of onClick to prevent blur
  * Force re-render on selection change
* **Keyboard Shortcuts**:
  * Use keymap() plugin
  * Map keys to commands: 'Mod-b': toggleMark(schema.marks.strong)
  * Chain multiple keymaps (custom keymap, then baseKeymap)
  * Commands return boolean (true = handled)
* **Lifecycle Management**:
  * Initialize in useEffect with empty dependency array
  * Store EditorView in ref
  * Return cleanup function that calls view.destroy()
  * Don't update content prop after mount (causes conflicts)
* **Current Implementation**:
  * ~400 lines total (ProseMirrorArea.tsx)
  * Schema setup (~15 lines)
  * Serialization helpers (~30 lines)
  * Custom onChange plugin (~20 lines)
  * Toolbar button component (~20 lines)
  * Toolbar component (~200 lines)
  * Main component (~115 lines)
  * Similar effort to Slate, more than all other editors except Slate

## Future Improvements

* Could add more features:
  - Tables (requires additional schema and commands)
  - Images with upload and resize
  - Links with URL editing UI
  - Text alignment controls
  - Font size and color options
  - Mentions/autocomplete
  - Embeds (YouTube, etc.)
  - Advanced lists (task lists, nested)
* Could enhance architecture:
  - Real-time collaboration (via prosemirror-collab + backend)
  - Comments and annotations
  - Track changes / suggestions mode
  - Version history UI
  - Markdown input rules (via prosemirror-inputrules)
* Could improve toolbar:
  - Floating/bubble toolbar (like Medium)
  - Slash commands (like Notion)
  - Formatting menu on text selection
  - Block drag handles
* Could optimize:
  - Virtualization for large documents
  - Lazy loading plugins
  - Reduce re-renders
  - Performance monitoring
* Could add polish:
  - Dark mode support
  - Keyboard shortcuts panel
  - Command palette
  - Better placeholder handling
  - Improved focus management

## Lessons Learned

**What Makes ProseMirror Different**:
1. It's a *toolkit*, not a *component* - you build the editor yourself
2. Schema system is unique and powerful - prevents invalid documents
3. Designed for collaboration from the ground up
4. Most mature and battle-tested of the "framework" editors
5. TipTap wraps ProseMirror with better API - consider using TipTap first!

**When ProseMirror Shines**:
- Building custom editorial experiences (CMS, publishing platforms)
- Real-time collaborative editing applications
- When you need schema-driven content validation
- Building an editor product/framework (like TipTap)
- Complex document structures with strict rules
- When you've tried TipTap and need to go deeper

**When ProseMirror Struggles**:
- Quick prototypes or MVPs (use TipTap, Quill, or commercial editor)
- Teams without strong technical expertise
- Simple rich text needs (basic formatting)
- When you want UI out of the box
- Projects with tight deadlines

**ProseMirror vs TipTap**:
- TipTap is built on ProseMirror and makes it much easier to use
- TipTap provides UI components, better API, and good defaults
- Use TipTap unless you need lower-level control than TipTap provides
- Most people should start with TipTap, not ProseMirror directly
- ProseMirror is like React - TipTap is like Next.js

**Comparison to Similar Frameworks**:
- Slate: Similar complexity, React-only, simpler data model
- Lexical: More modern, React-first, easier API, less mature
- TipTap: Wraps ProseMirror with better DX - use this instead!
- Quill/Draft.js: Higher level, less flexible, easier to start

**Our Implementation**: Successfully demonstrates ProseMirror's capabilities with basic rich text features. A production editor would benefit from more features (tables, images, links, collaboration). This implementation took similar effort to Slate (~400 lines), significantly more than TipTap (~250 lines with its APIs) or Quill (~90 lines). **Key takeaway**: ProseMirror is powerful but verbose. TipTap provides similar power with better developer experience. Consider TipTap first unless you need capabilities beyond what TipTap offers.

## Why TipTap Exists

This implementation clearly shows why TipTap was created. TipTap is ProseMirror with:
- Better, more intuitive API
- UI components included
- Extensions system that's easier to use
- Collaborative editing made simpler
- Better TypeScript experience
- Comprehensive documentation with examples
- Faster development experience

If you're considering ProseMirror, **seriously evaluate TipTap first**. You get ProseMirror's power with significantly less complexity. Only go directly to ProseMirror if you need control beyond what TipTap's extension system provides.
