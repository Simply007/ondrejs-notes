# Remirror Notes

* Remirror: https://remirror.io
* ProseMirror toolkit wrapper for React
* Created by Ifiok Jr. and maintained by the Remirror team
* First released in 2019
* Free and open-source (MIT license)
* Powers various editors and applications with React integration
* Philosophy: "Making ProseMirror easier to use"
* Built on top of ProseMirror, providing a simpler API and better React integration

## Core Philosophy

**ProseMirror Made Easier**: Remirror is explicitly designed as a React wrapper around ProseMirror with better DX. Key principles:
- **Extension-based**: Modular architecture using extensions instead of raw plugins
- **React-first**: Designed specifically for React applications
- **Simplified API**: Cleaner, more intuitive API than raw ProseMirror
- **Hook-based**: Uses React hooks for state and commands
- **Type-safe**: Built with TypeScript from the ground up
- **Batteries included**: Includes many common extensions out of the box

This provides much better developer experience than raw ProseMirror while maintaining its power.

## Implementation Experience

### Positive Aspects

* **Much Easier Than ProseMirror**: Significantly simplified API
  * Cleaner command interface via `useCommands` hook
  * Simpler active state tracking via `useActive` hook
  * Chained commands for composing operations
  * Less boilerplate than raw ProseMirror
  * Extension system is more intuitive than plugins
* **React Integration**: First-class React support
  * Designed specifically for React
  * Uses hooks naturally
  * Easy component composition
  * React context for editor state
  * No manual DOM management needed
* **Extension System**: Well-designed modularity
  * Extensions are more intuitive than ProseMirror plugins
  * Many built-in extensions available
  * Easy to enable/disable features
  * Clear extension configuration API
  * Good extension composition
* **HTML Support**: Built-in HTML serialization
  * `stringHandler: 'html'` for easy HTML content
  * `OnChangeHTML` component for HTML onChange
  * Better than manual ProseMirror DOMParser/Serializer
  * Works well with other editors in this project
* **TypeScript Support**: Excellent type safety
  * Written in TypeScript
  * Good type inference for commands
  * Extension types well-defined
  * Better TS experience than many alternatives
* **Good Documentation**: Comprehensive docs
  * Clear API reference
  * Good getting started guide
  * Extension documentation
  * Storybook examples
* **Active Development**: Well-maintained project
  * Regular updates
  * Active community
  * Responsive maintainers
  * Good GitHub presence

### Challenges & Considerations

* **React 19 Compatibility**: Peer dependency issues
  * Currently supports React 16-18, not React 19 yet
  * Needs `--legacy-peer-deps` flag for installation
  * Works with React 19 but not officially supported
  * May need updates for full React 19 support
* **Learning Curve**: Still requires understanding
  * Easier than ProseMirror but not trivial
  * Extension system needs learning
  * Command API requires familiarity
  * More complex than Quill or simple editors
  * Less complex than raw ProseMirror or Slate
* **Smaller Ecosystem**: Not as large as TipTap
  * TipTap has larger community and more extensions
  * Fewer third-party extensions compared to TipTap
  * Less community content and examples
  * Documentation not as extensive as TipTap
* **ProseMirror Dependency**: Inherits ProseMirror complexity
  * Still based on ProseMirror's concepts
  * Some ProseMirror knowledge helpful
  * Can hit ProseMirror limitations
  * Not as simple as non-ProseMirror editors
* **Bundle Size**: Moderate size
  * Includes ProseMirror core
  * Extensions add to bundle
  * Larger than Quill or simple editors
  * Comparable to TipTap
* **API Quirks**: Some rough edges
  * Some commands need empty object `{}`
  * TypeScript types sometimes require workarounds
  * Chain API not always intuitive
  * Documentation gaps in some areas

## Key Features (As Implemented)

* **Text Formatting**: Standard mark types
  * Bold
  * Italic
  * Strike-through
  * Underline
  * Inline code
* **Block Types**: Common block elements
  * Paragraphs
  * Headings (H1-H6)
  * Blockquotes
  * Code blocks
* **Lists**: Full list support
  * Ordered (numbered) lists
  * Unordered (bulleted) lists
  * Task lists with checkboxes
* **Tables**: Table support
  * Insert tables via `createTable` command
  * Built-in table extension
  * Table editing capabilities
* **Media**:
  * Images via `insertImage` command
  * YouTube embeds via HTML insertion
  * Links with URL prompt
* **Special Elements**:
  * Hard break (Shift+Enter)
  * Horizontal rule
* **History**: Undo/redo support
  * Built-in history extension
  * Standard undo/redo commands
* **Placeholder**: Customizable placeholder text
* **Drop & Gap Cursors**: Visual feedback
  * Drop cursor for drag operations
  * Gap cursor for positioning
* **Toolbar**: Custom React component
  * Button components using hooks
  * Active state indicators
  * Disabled state handling
  * Similar functionality to TipTap

## Architecture

* **Extensions**: Core building blocks
  * Extensions provide features (marks, nodes, commands)
  * Configure extensions with options object
  * Compose extensions in array
  * Each extension can add commands, state, etc.
* **useRemirror Hook**: Editor initialization
  * `useRemirror({ extensions, content, stringHandler })`
  * Returns `{ manager, state }`
  * Manager controls editor lifecycle
  * Initial state from content
* **Remirror Component**: Main wrapper
  * `<Remirror manager={manager} initialContent={state}>`
  * Wraps editor and provides context
  * Children can use hooks
* **useCommands Hook**: Command interface
  * Access all extension commands
  * Simple function calls: `commands.toggleBold()`
  * Check enabled state: `commands.toggleBold.enabled()`
* **useActive Hook**: Active state tracking
  * Check if marks/nodes active: `active.bold()`
  * Returns boolean or attribute object
  * Useful for toolbar button states
* **useChainedCommands Hook**: Command composition
  * Chain multiple commands: `chain.removeLink().run()`
  * Compose complex operations
  * More flexible than individual commands
* **OnChangeHTML Component**: HTML serialization
  * `<OnChangeHTML onChange={handler} />`
  * Provides HTML string on each change
  * Simpler than manual serialization
* **React Context**: State sharing
  * Editor state available via context
  * Hooks access context automatically
  * Clean component composition

## Comparison with Other Editors

**vs ProseMirror**:
- Remirror: Built on ProseMirror with much better API
- ProseMirror: Lower level, more verbose, more control
- Remirror: React-specific, easier to use
- ProseMirror: Framework-agnostic
- Use Remirror if you're using React and want easier API

**vs TipTap**:
- Both: Built on ProseMirror with better APIs
- Remirror: React-focused, hook-based
- TipTap: Framework-agnostic (has Vue, vanilla, React support)
- TipTap: Larger ecosystem and community
- TipTap: More mature and widely used
- Remirror: Better for pure React apps
- TipTap: Better for multi-framework or larger ecosystem

**vs Lexical**:
- Lexical: Meta's React editor framework
- Remirror: Built on ProseMirror
- Lexical: Custom architecture, not ProseMirror-based
- Both: Good React integration
- Lexical: More modern, growing faster
- Remirror: Benefits from ProseMirror ecosystem

**vs Slate**:
- Both: React-specific frameworks
- Slate: JSON-based document model
- Remirror: ProseMirror-based (more mature foundation)
- Remirror: Better defaults and built-in features
- Slate: More flexible data model
- Remirror: Easier to get started

**vs Quill/CKEditor/TinyMCE**:
- Remirror: Framework for custom editors
- Others: Complete ready-made solutions
- Remirror: More work to set up
- Others: Faster to deploy
- Remirror: More flexible and customizable
- Others: More features out of the box

## Pros

* Significantly easier to use than raw ProseMirror
* Excellent React integration with hooks
* Extension system is intuitive and modular
* Good TypeScript support with strong typing
* HTML serialization built-in and easy to use
* Clean command and active state APIs
* Less boilerplate than ProseMirror or Slate
* Built on battle-tested ProseMirror foundation
* Good documentation with API reference
* Active development and maintenance
* Free and open-source (MIT license)
* Many built-in extensions available
* Chained commands for complex operations
* Better DX than raw ProseMirror

## Cons

* Not compatible with React 19 officially (requires --legacy-peer-deps)
* Smaller ecosystem than TipTap
* Still requires learning curve (easier but not trivial)
* Inherits some ProseMirror complexity
* Some API quirks and rough edges
* Documentation gaps in some areas
* Less mature than TipTap
* Fewer third-party extensions available
* Not as simple as Quill or basic editors
* Bundle size moderate (includes ProseMirror)

## Recommendations

* **Perfect for**:
  - React applications needing rich text editing
  - Projects already using ProseMirror wanting better React integration
  - Teams comfortable with React hooks
  - Applications needing customizable editor
  - Projects wanting easier API than raw ProseMirror
  - When you want ProseMirror power with better DX

* **Consider if**:
  - You're building a React-only application
  - You need ProseMirror's power but want easier API
  - You're comfortable with React hooks and context
  - You want extension-based architecture
  - You prefer TypeScript with good type safety
  - You need HTML serialization built-in

* **Avoid if**:
  - You need simple out-of-box editor (use Quill, CKEditor)
  - You need multi-framework support (use TipTap instead)
  - You need React 19 official support now
  - You want largest possible ecosystem (use TipTap)
  - You need ready-made editor with no setup
  - Timeline is very tight (use commercial editor)
  - You're not using React (use TipTap or others)

## Technical Details

* **Core packages**:
  * `remirror` - Core package with extensions
  * `@remirror/react` - React integration and hooks
  * `@remirror/pm` - ProseMirror dependencies
  * `@remirror/react-components` - Optional React UI components
* **Extensions from**:
  * `remirror/extensions` - All extensions exported from here
  * BoldExtension, ItalicExtension, etc.
  * HeadingExtension, BlockquoteExtension, etc.
  * ListExtensions (BulletList, OrderedList, TaskList)
  * TableExtension, LinkExtension, ImageExtension
  * CodeExtension, CodeBlockExtension
  * HardBreakExtension, HorizontalRuleExtension
  * HistoryExtension, PlaceholderExtension
  * DropCursorExtension, GapCursorExtension
* **Bundle size**:
  * Core + React: ~100KB minified and gzipped (with ProseMirror)
  * Extensions add based on what you include
  * Modular: only include needed extensions
  * Comparable to TipTap
* **License**: MIT (very permissive open source)
* **Framework support**:
  * React-first design
  * React 16-18 officially supported
  * Works with React 19 (use --legacy-peer-deps)
  * Not designed for other frameworks
* **Browser support**: Modern browsers (ES6+)
* **Updates**: Active development, regular releases
* **TypeScript**: Written in TypeScript, excellent type support
* **Document Format**: ProseMirror document model
* **Customization**: High (extension-based)

## Integration Notes

* **React Integration**: Simple and clean
  * Use `useRemirror` hook to initialize
  * Wrap with `<Remirror>` component
  * Use hooks inside for commands/state
  * `OnChangeHTML` for onChange handler
  * All hook-based, very React-idiomatic
* **HTML Conversion**:
  * `stringHandler: 'html'` for HTML content
  * `OnChangeHTML` component for HTML output
  * Much simpler than ProseMirror's DOMParser/Serializer
  * Works seamlessly with other editors in this project
* **Extension Configuration**:
  * Create extensions with `new ExtensionName(options)`
  * Most extensions accept options object (may need empty `{}`)
  * Pass array of extensions to `useRemirror`
  * Extensions compose cleanly
* **Command Usage**:
  * `const commands = useCommands()` to get commands
  * Call commands: `commands.toggleBold()`
  * Check enabled: `commands.toggleBold.enabled()`
  * Simple and intuitive API
* **Active State**:
  * `const active = useActive()` to get active state
  * Check marks/nodes: `active.bold()`, `active.heading()`
  * Returns boolean or attributes
  * Perfect for toolbar buttons
* **Chained Commands**:
  * `const chain = useChainedCommands()` for chaining
  * Chain operations: `chain.removeLink().run()`
  * Must call `.run()` at end
  * Compose complex operations
* **Toolbar Implementation**:
  * Create React component
  * Use `useCommands`, `useActive`, `useChainedCommands` hooks
  * Render buttons with onClick handlers
  * Apply active/disabled classes based on state
  * ~200 lines for full-featured toolbar
* **Installation Quirk**:
  * Use `npm install --legacy-peer-deps` for React 19
  * Required due to peer dependency constraints
  * Works fine despite warning
  * May be fixed in future versions
* **TypeScript Tips**:
  * Extensions may need empty object: `new Extension({})`
  * Some command return types need attention
  * Chain commands with `.run()` at end
  * Active state types generally good
* **Current Implementation**:
  * ~300 lines total (RemirrorArea.tsx)
  * Hook-based React integration (~20 lines)
  * MenuBar toolbar (~180 lines)
  * Extension configuration (~25 lines)
  * Main component (~75 lines)
  * Similar effort to TipTap, much less than ProseMirror
  * More intuitive than Slate

## Future Improvements

* Could add more features:
  - Text color and highlighting
  - Font size and family controls
  - Text alignment options
  - More advanced tables (merge cells, etc.)
  - Image upload and resize
  - Embeds (Twitter, etc.)
  - Mentions/autocomplete
  - Emoji picker
  - Markdown shortcuts
* Could enhance architecture:
  - Real-time collaboration (via Yjs extension)
  - Comments and annotations
  - Version history
  - Import/export (Markdown, etc.)
* Could improve toolbar:
  - Floating toolbar on selection
  - Slash commands
  - Block drag handles
  - Formatting menu
* Could add polish:
  - Better placeholder handling
  - Dark mode support
  - Keyboard shortcuts panel
  - Command palette
  - Better mobile support

## Lessons Learned

**What Makes Remirror Different**:
1. Built on ProseMirror but with much better API
2. React-first design with hooks
3. Extension system more intuitive than ProseMirror plugins
4. Simpler than raw ProseMirror, more powerful than basic editors
5. Good middle ground between ease-of-use and flexibility

**When Remirror Shines**:
- React applications needing rich text editor
- When you want ProseMirror power without complexity
- Projects needing customization beyond basic editors
- Teams comfortable with React hooks
- When you prefer hook-based API over imperative

**When Remirror Struggles**:
- Multi-framework projects (TipTap better)
- Need React 19 official support immediately
- Want largest ecosystem (TipTap wins)
- Simple needs (Quill or commercial editors faster)
- Non-React projects (not designed for it)

**Remirror vs TipTap vs ProseMirror**:
- ProseMirror: Powerful but complex, framework-agnostic
- TipTap: Built on ProseMirror, larger ecosystem, multi-framework
- Remirror: Built on ProseMirror, React-focused, cleaner hooks API
- For React-only: Choose Remirror or TipTap based on preference
- For multi-framework: Choose TipTap
- For maximum control: Choose ProseMirror directly
- For ease of use in React: Remirror is excellent choice

**Comparison to Similar Frameworks**:
- vs Lexical: Both React-first, Lexical newer/more modern, Remirror benefits from ProseMirror maturity
- vs Slate: Both React-only, Remirror easier API, Slate more flexible data
- vs TipTap: TipTap larger ecosystem, Remirror better React hooks API
- vs ProseMirror: Remirror much easier to use, less control

**Our Implementation**: Successfully demonstrates Remirror's capabilities with comprehensive rich text features. The implementation took ~300 lines, significantly less than raw ProseMirror (~400 lines) and similar to TipTap (~250 lines). The hook-based API is more intuitive than ProseMirror's imperative approach. **Key takeaway**: Remirror provides excellent middle ground - easier than ProseMirror, powerful enough for most needs, perfect for React apps. If you need ProseMirror's power in React, Remirror is highly recommended.

## Why Choose Remirror

Remirror exists to make ProseMirror accessible to React developers. Choose Remirror when:
- You're building a React application
- You need more power than Quill/simple editors
- You want ProseMirror foundation with better DX
- You prefer hooks API over imperative code
- You value TypeScript support
- You want extension-based architecture

If you need multi-framework support, choose TipTap instead. If you need maximum simplicity, choose Quill or commercial editor. If you need maximum control, use ProseMirror directly. But for React apps needing powerful, customizable editing, Remirror is an excellent choice.
