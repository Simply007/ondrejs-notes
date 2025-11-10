import { useEffect, useRef, useState } from 'react';
import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer, Node as ProseMirrorNode } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, toggleMark, setBlockType, wrapIn } from 'prosemirror-commands';
import { wrapInList, liftListItem, sinkListItem } from 'prosemirror-schema-list';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import './ProseMirrorArea.css';

// Create schema with list support
const mySchema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block'),
  marks: basicSchema.spec.marks,
});

// Custom plugin to handle onChange
function createOnChangePlugin(onChange: (html: string) => void) {
  return new Plugin({
    state: {
      init() {
        return null;
      },
      apply(tr: Transaction) {
        return null;
      },
    },
    view() {
      return {
        update: (view: EditorView) => {
          const html = serializeToHTML(view.state.doc);
          onChange(html);
        },
      };
    },
  });
}

// HTML serialization
function serializeToHTML(doc: ProseMirrorNode): string {
  const div = document.createElement('div');
  const fragment = DOMSerializer.fromSchema(mySchema).serializeFragment(doc.content);
  div.appendChild(fragment);
  return div.innerHTML;
}

// HTML deserialization
function deserializeFromHTML(html: string): ProseMirrorNode {
  const div = document.createElement('div');
  div.innerHTML = html;
  return DOMParser.fromSchema(mySchema).parse(div);
}

// Toolbar button component
function ToolbarButton({
  active,
  disabled,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      className={`toolbar-button ${active ? 'is-active' : ''}`}
      disabled={disabled}
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      title={title}
      type="button"
    >
      {children}
    </button>
  );
}

// Toolbar component
function Toolbar({ view }: { view: EditorView | null }) {
  const [, forceUpdate] = useState({});

  // Force re-render when selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      forceUpdate({});
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  if (!view) return null;

  const { state } = view;
  const { schema } = state;

  // Check if mark is active
  const isMarkActive = (markType: string) => {
    const type = schema.marks[markType];
    if (!type) return false;
    const { from, $from, to, empty } = state.selection;
    if (empty) {
      return !!type.isInSet(state.storedMarks || $from.marks());
    }
    return state.doc.rangeHasMark(from, to, type);
  };

  // Check if block type is active
  const isBlockActive = (nodeType: string, attrs?: Record<string, unknown>) => {
    const type = schema.nodes[nodeType];
    if (!type) return false;
    const { $from, to } = state.selection;
    let hasType = false;
    state.doc.nodesBetween($from.pos, to, (node) => {
      if (node.type === type) {
        if (attrs) {
          hasType = Object.keys(attrs).every((key) => node.attrs[key] === attrs[key]);
        } else {
          hasType = true;
        }
      }
      return !hasType;
    });
    return hasType;
  };

  // Toggle mark command
  const toggleMarkCommand = (markType: string) => {
    const type = schema.marks[markType];
    if (!type) return;
    toggleMark(type)(state, view.dispatch);
    view.focus();
  };

  // Set block type command
  const setBlockTypeCommand = (nodeType: string, attrs?: Record<string, unknown>) => {
    const type = schema.nodes[nodeType];
    if (!type) return;
    setBlockType(type, attrs)(state, view.dispatch);
    view.focus();
  };

  // Wrap in block command
  const wrapInCommand = (nodeType: string, attrs?: Record<string, unknown>) => {
    const type = schema.nodes[nodeType];
    if (!type) return;
    wrapIn(type, attrs)(state, view.dispatch);
    view.focus();
  };

  // List commands
  const toggleList = (listType: string) => {
    const type = schema.nodes[listType];
    if (!type) return;
    wrapInList(type)(state, view.dispatch);
    view.focus();
  };

  const insertHardBreak = () => {
    const hardBreakType = schema.nodes.hard_break;
    if (!hardBreakType) return;
    const tr = state.tr.replaceSelectionWith(hardBreakType.create());
    view.dispatch(tr);
    view.focus();
  };

  const insertHorizontalRule = () => {
    const hrType = schema.nodes.horizontal_rule;
    if (!hrType) return;
    const tr = state.tr.replaceSelectionWith(hrType.create());
    view.dispatch(tr);
    view.focus();
  };

  return (
    <div className="prosemirror-toolbar">
      <div className="toolbar-group">
        <ToolbarButton
          active={isMarkActive('strong')}
          onClick={() => toggleMarkCommand('strong')}
          title="Bold (Ctrl+B)"
        >
          Bold
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive('em')}
          onClick={() => toggleMarkCommand('em')}
          title="Italic (Ctrl+I)"
        >
          Italic
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive('code')}
          onClick={() => toggleMarkCommand('code')}
          title="Code (Ctrl+`)"
        >
          Code
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          active={isBlockActive('paragraph')}
          onClick={() => setBlockTypeCommand('paragraph')}
          title="Paragraph"
        >
          Paragraph
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('heading', { level: 1 })}
          onClick={() => setBlockTypeCommand('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('heading', { level: 2 })}
          onClick={() => setBlockTypeCommand('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('heading', { level: 3 })}
          onClick={() => setBlockTypeCommand('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('heading', { level: 4 })}
          onClick={() => setBlockTypeCommand('heading', { level: 4 })}
          title="Heading 4"
        >
          H4
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('heading', { level: 5 })}
          onClick={() => setBlockTypeCommand('heading', { level: 5 })}
          title="Heading 5"
        >
          H5
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('heading', { level: 6 })}
          onClick={() => setBlockTypeCommand('heading', { level: 6 })}
          title="Heading 6"
        >
          H6
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          active={isBlockActive('bullet_list')}
          onClick={() => toggleList('bullet_list')}
          title="Bullet List"
        >
          Bullet List
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('ordered_list')}
          onClick={() => toggleList('ordered_list')}
          title="Ordered List"
        >
          Ordered List
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          active={isBlockActive('blockquote')}
          onClick={() => wrapInCommand('blockquote')}
          title="Blockquote"
        >
          Blockquote
        </ToolbarButton>
        <ToolbarButton
          active={isBlockActive('code_block')}
          onClick={() => setBlockTypeCommand('code_block')}
          title="Code Block"
        >
          Code Block
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton onClick={insertHardBreak} title="Hard Break (Shift+Enter)">
          Hard Break
        </ToolbarButton>
        <ToolbarButton onClick={insertHorizontalRule} title="Horizontal Rule">
          Horizontal Rule
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton onClick={() => undo(state, view.dispatch)} title="Undo (Ctrl+Z)">
          Undo
        </ToolbarButton>
        <ToolbarButton onClick={() => redo(state, view.dispatch)} title="Redo (Ctrl+Y)">
          Redo
        </ToolbarButton>
      </div>
    </div>
  );
}

// Main component
export default function ProseMirrorArea({
  documentId,
  content,
  onChange,
}: {
  documentId: string;
  content: string;
  onChange: (newContent: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [view, setView] = useState<EditorView | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Parse initial content
    const doc = content && content.trim() !== ''
      ? deserializeFromHTML(content)
      : mySchema.node('doc', null, [mySchema.node('paragraph')]);

    // Create editor state
    const state = EditorState.create({
      doc,
      plugins: [
        history(),
        keymap({
          'Mod-z': undo,
          'Mod-y': redo,
          'Mod-Shift-z': redo,
          'Mod-b': toggleMark(mySchema.marks.strong),
          'Mod-i': toggleMark(mySchema.marks.em),
          'Mod-`': toggleMark(mySchema.marks.code),
          'Shift-Enter': (state, dispatch) => {
            if (dispatch) {
              dispatch(state.tr.replaceSelectionWith(mySchema.nodes.hard_break.create()));
            }
            return true;
          },
          'Shift-Ctrl-8': wrapInList(mySchema.nodes.bullet_list),
          'Shift-Ctrl-9': wrapInList(mySchema.nodes.ordered_list),
          'Enter': (state, dispatch) => {
            const { $from } = state.selection;
            const listItemType = mySchema.nodes.list_item;

            // Check if we're in a list item
            for (let d = $from.depth; d >= 0; d--) {
              if ($from.node(d).type === listItemType) {
                // If the list item is empty, lift it out
                if ($from.parent.content.size === 0) {
                  return liftListItem(listItemType)(state, dispatch);
                }
                break;
              }
            }
            return false;
          },
          'Tab': (state, dispatch) => {
            return sinkListItem(mySchema.nodes.list_item)(state, dispatch);
          },
          'Shift-Tab': (state, dispatch) => {
            return liftListItem(mySchema.nodes.list_item)(state, dispatch);
          },
        }),
        keymap(baseKeymap),
        gapCursor(),
        dropCursor(),
        createOnChangePlugin(onChange),
      ],
    });

    // Create editor view
    const editorView = new EditorView(editorRef.current, {
      state,
      attributes: {
        class: 'prosemirror-editor',
      },
    });

    viewRef.current = editorView;
    setView(editorView);

    // Cleanup
    return () => {
      editorView.destroy();
      viewRef.current = null;
      setView(null);
    };
  }, []);

  // Don't update content externally to avoid conflicts
  // The editor maintains its own state after initialization

  return (
    <div className="prosemirror-container" data-document-id={documentId}>
      <Toolbar view={view} />
      <div ref={editorRef} className="prosemirror-editor-wrapper" />
    </div>
  );
}
