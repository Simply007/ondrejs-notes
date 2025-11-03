Notes on using `contenteditable` in React:

- Simple mark
- `suppressContentEditableWarning` warning: <https://legacy.reactjs.org/docs/dom-elements.html#suppresscontenteditablewarning>
- ⚠️ Inconsistent behavior across browsers
- ⚠️ Some formatting differences
- ⚠️ Mobile support varies
- No sanitization
- You must handle cursor position manually when updating content
- Old API for commands and undo and redo - when using modern API, you need to implement undo redo semi-manually
- No built-in undo/redo support and "del"/"backspace" handling when i.e. in some node like blockquote - you can't just delete and get to paragraph
  - basically no interaction with keyboard as you are used to
  - you need to handle all key events manually - clear marks and clear nodes
- No collaborative editing support - nor real-time nor offline
- All of the complex UI has to be handled including the business logic - headless approach of other editor can at least provide the business logic
- No support for custom plugins or extensions
- Necessity to use `execCommand` - deprecated API with inconsistent support across browsers - see below what the rewrite would mean

## What Full execCommand Removal Would Require

### Inline Formatting

**Bold, Italic, Strikethrough** - Use Selection API + Range API with `surroundContents()` or `extractContents()`. Need to handle toggling on/off, detecting current state via DOM traversal or getComputedStyle, and managing alternative tags (B/STRONG, I/EM, S/STRIKE/DEL).

**Links** - Create `<a>` elements with `createElement()` and wrap selection using Range API. Need to handle editing existing links, removing links (unwrapping), and restoring selection position after insertion.

**Remove Formatting** - Extract selection contents and replace with plain text nodes. Strips all inline formatting but preserves text content.

### Block Formatting (Complex - ~100-150 lines each)

**Headings & Paragraphs (formatBlock)** - Find block-level parent element, create new block element, transfer all child nodes while preserving inline formatting. Complex edge cases include: handling multi-paragraph selections, nested blocks (blocks inside lists), empty blocks requiring placeholder content, and proper cursor restoration.

**Blockquote** - Same complexity as other block formatting, plus need to handle indentation levels and converting back to paragraphs.

### Lists (Very Complex - ~200-300 lines)

**Create Lists (insertUnorderedList/insertOrderedList)** - Convert paragraph(s) to list structure with proper `<ul>/<ol>` and `<li>` wrapping. Must handle: multi-paragraph selections (each becomes a list item), nested lists (indentation/outdenting), converting between UL and OL, and detecting when already in a list to remove it.

**List Editing** - Implement keyboard handlers for Enter key (new list item vs. exit list), Tab/Shift+Tab for indenting/outdenting, and Backspace at list start to convert back to paragraph. Requires tracking nested list depth and managing list continuations.

### Browser-Native Features (Medium - ~30-50 lines each)

**Insert Image** - Could use `insertHTMLAtCursor()` with `<img>` tags instead of execCommand. Simpler than other commands but need to handle URL validation and cursor positioning.

**Horizontal Rule & Line Break** - Use `insertHTMLAtCursor()` with `<hr>` or `<br>` tags. Relatively straightforward replacements.

### State Management & Detection

**Active Formatting Detection** - Already implemented using `getComputedStyle()` and DOM traversal for detecting bold/italic/strikethrough/headings/lists. No changes needed.

**Undo/Redo** - Already implemented with custom `useEditorHistory` hook using debounced HTML snapshots. No changes needed as execCommand undo is not used.
