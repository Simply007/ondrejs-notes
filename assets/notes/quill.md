# Quill Notes

* Quill: https://quilljs.com/
* Open-source WYSIWYG editor since 2013
* Created by Slab (now part of Notion)
* Designed for web applications with focus on extensibility
* Free and open-source (BSD-3-Clause license)
* Clean API with modular architecture
* Used by platforms like LinkedIn, Salesforce, and more

## ⚠️ Important: React Wrapper Status

**Quill does NOT have an official React wrapper.** All React integrations are community-maintained.

### React Wrapper Options

**1. react-quill (original community wrapper)**
- **Author**: zenoamaro (community maintainer, NOT Quill/Slab team)
- **Status**: Most popular historically (~1M weekly downloads)
- **Latest version**: 2.0.0
- **❌ CRITICAL ISSUE**: Does NOT support React 19
  - Uses deprecated `ReactDOM.findDOMNode` (removed in React 19)
  - Error: `TypeError: react_dom_1.default.findDOMNode is not a function`
  - Multiple unresolved GitHub issues: #972, #981, #989, #1037
  - Package appears unmaintained (issues open since 2024)
- **Verdict**: ❌ Cannot use with React 19 projects

**2. react-quill-new (maintained fork) ✅ RECOMMENDED**
- **Status**: Maintained community fork of react-quill
- **Latest version**: 3.6.0
- **✅ React 19 Support**: Officially supports React 16, 17, 18, AND 19
- **API Compatibility**: Drop-in replacement for react-quill
- **Peer Dependencies**: Requires `quill-delta` ^5.1.0
- **Migration**:
  ```bash
  npm uninstall react-quill
  npm install react-quill-new quill-delta
  # Change import: import ReactQuill from 'react-quill-new';
  ```
- **Verdict**: ✅ Use this for React 19 projects

**3. Direct Quill Integration (vanilla JS)**
- **Approach**: Use Quill core directly with React useEffect
- **Pros**: Full control, no wrapper dependency
- **Cons**: Manual React integration, more boilerplate
- **Use case**: When you need deep customization or avoid wrapper dependencies

### Current Implementation Status

✅ **This project uses DIRECT Quill integration** - No wrapper dependencies!

**Why we're NOT using react-quill or react-quill-new**:
- **Neither is maintained by Quill team** - Both are community wrappers, not official
- **react-quill**: Unmaintained, doesn't support React 19, uses deprecated APIs
- **react-quill-new**: Better fork but still a community wrapper with maintenance uncertainty
- **Maintenance risk**: Relying on community maintainers who may abandon projects
- **Wrapper overhead**: Additional abstraction layer we don't need

**Current approach - Direct Integration**:
- Based on official Quill React playground: https://quilljs.com/playground/react
- This is the **official recommended approach** by Quill team
- Direct `new Quill()` instantiation in React useEffect
- Full control over Quill instance and lifecycle
- No third-party wrapper dependencies
- Works with all React versions (16, 17, 18, 19+)
- More maintainable long-term

**Implementation details**:
- Package: `quill` core only (no wrappers)
- Pattern: Uncontrolled component with forwardRef
- HTML conversion: `clipboard.dangerouslyPasteHTML()` for input, `root.innerHTML` for output
- Event handling: Direct `Quill.events.TEXT_CHANGE` listener
- See QuillArea.tsx for full implementation

This documentation serves as a **checkpoint** for understanding why direct integration is preferred over community wrappers.

## Implementation Experience

### Positive Aspects

* **Quick Setup**: Very straightforward integration
  * Similar ease to Froala/TinyMCE setup
  * ~90 lines of code for full-featured editor
  * Configuration via modules object is intuitive
  * React wrapper (`react-quill`) simplifies React integration
* **Clean UI**: Professional and modern interface
  * Snow theme provides polished toolbar design
  * Consistent with modern web applications
  * Mobile-responsive out of the box
  * Minimal but effective visual design
* **Open Source**: No licensing costs
  * BSD-3-Clause license allows commercial use
  * Active community development
  * Free for all use cases
  * No trial watermarks or restrictions
* **Lightweight**: Smaller bundle than commercial alternatives
  * Core: ~43KB minified and gzipped
  * Smaller than TinyMCE, Froala, CKEditor
  * Larger than Lexical, comparable to TipTap with UI
* **Good Documentation**: Clear and comprehensive docs
  * Well-documented API reference
  * Interactive examples and playground
  * Good community tutorials and guides
  * Active discussions on GitHub
* **Extensible Architecture**: Delta-based document model
  * Custom formats and modules can be added
  * Blots system for custom content types
  * Modules for extending functionality
  * Themes can be customized or created
* **HTML Compatibility**: Works well with other editors
  * Standard HTML output/input
  * Good interoperability with CKEditor, TipTap, Lexical content
  * Clipboard module handles paste intelligently

### Challenges & Considerations

* **React Integration**: Direct Quill integration (no wrapper)
  * ⚠️ **IMPORTANT**: See "React Wrapper Status" section above for critical information
  * ✅ **This project uses direct Quill integration** (official recommended approach)
  * No community wrapper dependencies (react-quill or react-quill-new)
  * Based on official Quill React playground pattern
  * Direct instantiation with `new Quill()` in React useEffect
  * Full control over instance and lifecycle
  * Works with all React versions including React 19
  * More maintainable long-term (no third-party wrapper maintenance risk)
* **Customization Complexity**: Advanced customization requires learning Blots
  * Custom content types need Blot understanding
  * Steeper learning curve for deep customization
  * Less straightforward than TipTap's extension system
  * Documentation for advanced features could be better
* **Delta Format**: Internal format is not HTML
  * Uses Delta (JSON) as internal representation
  * Conversion to/from HTML happens at boundaries
  * Can complicate some integrations
  * Delta is powerful but unfamiliar to most developers
* **Limited Built-in Features**: Fewer features than commercial editors
  * No tables out of the box (requires custom module)
  * No advanced list features (multi-level requires work)
  * Image handling basic (no resize UI without custom module)
  * Collaboration requires separate implementation
* **Theme Limitations**: Only two official themes
  * Snow (toolbar) and Bubble (inline toolbar)
  * Creating custom themes requires CSS expertise
  * Less flexible than headless editors for UI customization
  * But more flexible than completely fixed UIs
* **Maintenance Pace**: Development slower than some alternatives
  * Less frequent updates compared to commercial editors
  * Some open issues on GitHub remain unresolved
  * Community contributions help but not as fast as Meta (Lexical) or commercial teams

## Key Features

* **Toolbar Configuration**: Highly customizable toolbar via modules
  * Headers (H1-H6)
  * Text formatting: Bold, Italic, Underline, Strike
  * Scripts: Subscript, Superscript
  * Colors: Text and background colors
  * Font: Font family and size options
  * Lists: Ordered, bullet, and checklist
  * Indentation: Indent/outdent
  * Alignment: Left, center, right, justify
  * Rich content: Blockquote, code blocks, links, images, videos
  * Utility: Clean formatting button
* **Formats**: All standard formats supported
  * Text: bold, italic, underline, strike, code, script, color, background
  * Block: header, blockquote, code-block, list, indent, align
  * Embed: link, image, video
* **Clipboard**: Smart paste handling
  * `matchVisual: false` for cleaner paste results
  * Preserves formatting when needed
  * Strips unnecessary styling
* **Themes**: Snow theme used (toolbar-based)
  * Alternative: Bubble theme (inline/floating toolbar)
  * Can be styled via CSS
  * Clean, minimal design philosophy

## Architecture

* **Delta-based Document Model**: Uses JSON for internal representation
  * Delta format: array of operations (insert, delete, retain)
  * HTML conversion at input/output boundaries
  * Enables better change tracking and operational transforms
* **Blots System**: Content is represented as Blots
  * Block Blots: paragraphs, headers, lists, etc.
  * Inline Blots: bold, italic, links, etc.
  * Embed Blots: images, videos, etc.
  * Custom Blots can be registered
* **Parchment**: Quill's document model layer
  * Schema definition for content
  * Handles document structure and validation
  * Extensible for custom content types
* **Modules System**: Functionality via modules
  * Core modules: Clipboard, History, Keyboard, Toolbar
  * Can create custom modules
  * Modules communicate via events and API
* **Event System**: Rich event system for integrations
  * `text-change` for content changes
  * `selection-change` for cursor/selection
  * Module-specific events
  * API methods return promises where appropriate

## Comparison with Other Editors

**vs CKEditor**:
- Quill: Open source, lighter, simpler API, fewer built-in features
- CKEditor: Commercial (premium features), more comprehensive, collaboration built-in
- Both: Complete WYSIWYG solutions with toolbar UI

**vs TinyMCE**:
- Quill: Open source, cleaner API, smaller bundle, fewer features
- TinyMCE: Commercial with free tier, more plugins, self-hosted option
- Quill: Better for programmatic manipulation
- TinyMCE: Better for content creation with many built-in tools

**vs Froala**:
- Quill: Free and open source, simpler, smaller
- Froala: Commercial, more features out-of-box, enterprise support
- Quill: Better for developers who want control
- Froala: Better for teams wanting complete solution

**vs TipTap**:
- Both: Open source with similar philosophy
- Quill: Complete UI, simpler initial setup, Delta model
- TipTap: Headless, full UI control, ProseMirror-based
- Quill: Better for quick implementation with standard UI
- TipTap: Better for complete UI customization

**vs Lexical**:
- Both: Modern, lightweight, extensible
- Quill: UI included, more mature, simpler API
- Lexical: Headless, Meta-backed, requires UI building
- Quill: Established and stable
- Lexical: Newer with modern React patterns

**vs TextArea**:
- Quill: Full WYSIWYG experience, rich formatting
- TextArea: Simple, no dependencies, raw HTML

## Pros

* Free and open source (BSD-3-Clause)
* Clean, modern UI with professional appearance
* Smaller bundle than commercial alternatives
* Well-documented API and good examples
* Active community and ecosystem
* Delta format enables advanced features (OT, CRDT)
* Good HTML compatibility for interoperability
* Mobile-responsive out of the box
* Extensible via modules and custom Blots
* No licensing headaches or costs
* Battle-tested in production applications

## Cons

* Not as feature-rich as commercial alternatives
* Advanced customization requires learning Delta/Blots
* Fewer built-in features (tables, advanced lists, etc.)
* Slower development pace than commercial or big-tech editors
* Delta format unfamiliar to most developers
* Theme customization requires CSS expertise
* No built-in collaboration features
* Some complex features need custom implementation
* Community support quality varies

## Recommendations

* **Good for**:
  - Projects needing open-source WYSIWYG solution
  - Applications with budget constraints (no license fees)
  - Developers comfortable with JSON/Delta formats
  - Projects needing lighter alternative to commercial editors
  - Applications requiring standard editor UI quickly
  - Teams wanting balance of features and simplicity

* **Consider if**:
  - You want open-source with no licensing costs
  - You need complete WYSIWYG UI without building it
  - You value clean, simple API
  - Your feature needs match what Quill provides
  - You want lighter bundle than TinyMCE/Froala/CKEditor
  - You're building content-creation interface

* **Avoid if**:
  - You need extensive built-in features (prefer TinyMCE/CKEditor/Froala)
  - You want complete UI control (use TipTap or Lexical)
  - You need built-in collaboration (prefer CKEditor)
  - You need bleeding-edge React patterns (use Lexical)
  - You require complex tables and advanced formatting
  - Minimal feature set sufficient (use TextArea)
  - You prefer vendor support for commercial product

## Technical Details

* **Core packages**:
  * `quill` (core editor - official from Slab) ✅ **ONLY package needed**
  * ⚠️ NO wrapper packages used (react-quill or react-quill-new)
  * Direct integration following official Quill React playground pattern
* **Bundle size**: ~43KB minified and gzipped (core only, no wrapper overhead)
* **License**: BSD-3-Clause (permissive open source)
* **Framework support**:
  * React: Direct integration (official pattern from https://quilljs.com/playground/react)
  * Vue, Angular: Similar direct integration patterns available
  * Vanilla JS: Native support
  * ⚠️ Community wrappers exist but NOT recommended (maintenance risk)
* **Browser support**: Modern browsers (IE11 with polyfills)
* **Updates**: Regular releases from Quill team, stable and maintained
* **Themes**: Snow (toolbar), Bubble (inline/floating)
* **Delta format**: JSON-based operational transform-friendly format
* **Extensibility**: Modules, Custom Blots, Parchment schema

## Integration Notes

* ✅ **React Integration**: Direct Quill integration (no wrapper)
  * Based on official Quill React playground: https://quilljs.com/playground/react
  * Implementation pattern: Uncontrolled component with forwardRef
  * Direct instantiation: `new Quill(element, config)`
  * Event handling: `quill.on(Quill.events.TEXT_CHANGE, callback)`
  * See QuillArea.tsx for complete implementation
* **HTML Conversion**:
  * Input: `quill.clipboard.dangerouslyPasteHTML(html)` to load HTML content
  * Output: `quill.root.innerHTML` to get HTML string
  * Works seamlessly with HTML content from other editors
* **Configuration**:
  * Toolbar configured via `modules.toolbar` array in Quill constructor
  * Snow theme provides familiar toolbar-based interface
  * Placeholder text set via `placeholder` option
  * Minimum height set to 400px via CSS for consistency
* **Lifecycle Management**:
  * Quill instance created in useEffect
  * Cleanup removes instance on unmount
  * Ref provides access to Quill instance for advanced use
* **Integration Benefits**:
  * No wrapper dependencies to maintain
  * Full access to Quill API
  * Works with React 19 and future versions
  * CSS customization via QuillArea.css
  * Compatible with existing note storage format (HTML strings)

## Future Improvements

* Could add custom modules:
  - Table support (via custom module or third-party)
  - Advanced image handling (resize, alignment UI)
  - Mention/autocomplete functionality
  - Custom toolbar buttons for app-specific features
* Could implement advanced features:
  - Character/word counter display
  - Real-time collaboration (via Yjs or custom OT)
  - Custom Blots for app-specific content types
  - Formula/equation support (via KaTeX)
* Could enhance theming:
  - Custom theme beyond Snow/Bubble
  - Dark mode support
  - Toolbar customization for better UX
* Could optimize bundle:
  - Import only needed formats/modules
  - Custom build configuration
  - Lazy load less-used features
