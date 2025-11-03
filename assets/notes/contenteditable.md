Motes on using `contenteditable` in React:

- Simple mark
- `suppressContentEditableWarning` warning: <https://legacy.reactjs.org/docs/dom-elements.html#suppresscontenteditablewarning>
- ⚠️ Inconsistent behavior across browsers
- ⚠️ Some formatting differences
- ⚠️ Mobile support varies
- No sanitization
- You must handle cursor position manually when updating content
- No built-in undo/redo support and "del"/"backspace" handling when i.e. in some node ile blockquote - you can!t just delete and get to paragraph
  - basically no iteraction with keyboard as you are used to
  - you need to handle all key events manually - clear makrs and clear nodes implemented
- No collaborative editing support - nor real-time nor offline
- All of the complex UI has to be handled including the business logic - headless approach of other editor can at least provide the business logic
- No support for custom plugins or extensions

