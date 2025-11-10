import { useEffect, useRef, useState } from 'react';
import { EditorState, Transaction, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer, Node as ProseMirrorNode, Mark, type MarkSpec, type NodeSpec, type DOMOutputSpec } from 'prosemirror-model';
import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { history, undo, redo } from 'prosemirror-history';
import { baseKeymap, toggleMark, setBlockType, wrapIn, chainCommands, newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock } from 'prosemirror-commands';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';
import { gapCursor } from 'prosemirror-gapcursor';
import { dropCursor } from 'prosemirror-dropcursor';
import { tableEditing, columnResizing, goToNextCell } from 'prosemirror-tables';
import './ProseMirrorArea.css';

// Define custom marks
const strikeSpec: MarkSpec = {
  parseDOM: [
    { tag: 's' },
    { tag: 'strike' },
    { tag: 'del' },
    { style: 'text-decoration=line-through' }
  ],
  toDOM(): DOMOutputSpec { return ['s', 0]; }
};

const underlineSpec: MarkSpec = {
  parseDOM: [
    { tag: 'u' },
    { style: 'text-decoration=underline' }
  ],
  toDOM(): DOMOutputSpec { return ['u', 0]; }
};

const linkSpec: MarkSpec = {
  attrs: {
    href: {},
    title: { default: null }
  },
  inclusive: false,
  parseDOM: [{
    tag: 'a[href]',
    getAttrs(dom) {
      const element = dom as HTMLElement;
      return {
        href: element.getAttribute('href'),
        title: element.getAttribute('title')
      };
    }
  }],
  toDOM(node: Mark): DOMOutputSpec {
    const { href, title } = node.attrs;
    return ['a', { href, title }, 0];
  }
};

// Define custom nodes
const taskItemSpec: NodeSpec = {
  attrs: { checked: { default: false } },
  content: 'paragraph block*',
  parseDOM: [{
    tag: 'li[data-task-item]',
    getAttrs(dom) {
      const element = dom as HTMLElement;
      return {
        checked: element.getAttribute('data-checked') === 'true'
      };
    }
  }],
  toDOM(node): DOMOutputSpec {
    return ['li', { 'data-task-item': 'true', 'data-checked': node.attrs.checked }, 0];
  }
};

const taskListSpec: NodeSpec = {
  group: 'block',
  content: 'task_item+',
  parseDOM: [{ tag: 'ul[data-task-list]' }],
  toDOM(): DOMOutputSpec {
    return ['ul', { 'data-task-list': 'true' }, 0];
  }
};

const youtubeSpec: NodeSpec = {
  attrs: { src: {} },
  group: 'block',
  parseDOM: [{
    tag: 'div[data-youtube-video]',
    getAttrs(dom) {
      const element = dom as HTMLElement;
      const iframe = element.querySelector('iframe');
      return { src: iframe?.getAttribute('src') || '' };
    }
  }],
  toDOM(node): DOMOutputSpec {
    return ['div', { 'data-youtube-video': '' },
      ['iframe', {
        src: node.attrs.src,
        width: '640',
        height: '360',
        frameborder: '0',
        allowfullscreen: 'true'
      }]
    ];
  }
};

const tableNodeSpec: NodeSpec = {
  content: 'table_row+',
  tableRole: 'table',
  isolating: true,
  group: 'block',
  parseDOM: [{ tag: 'table' }],
  toDOM(): DOMOutputSpec { return ['table', ['tbody', 0]]; }
};

const tableRowSpec: NodeSpec = {
  content: '(table_cell | table_header)*',
  tableRole: 'row',
  parseDOM: [{ tag: 'tr' }],
  toDOM(): DOMOutputSpec { return ['tr', 0]; }
};

const tableCellSpec: NodeSpec = {
  content: 'block+',
  attrs: {
    colspan: { default: 1 },
    rowspan: { default: 1 },
    colwidth: { default: null }
  },
  tableRole: 'cell',
  isolating: true,
  parseDOM: [{
    tag: 'td',
    getAttrs(dom) {
      const element = dom as HTMLElement;
      return {
        colspan: Number(element.getAttribute('colspan') || 1),
        rowspan: Number(element.getAttribute('rowspan') || 1),
        colwidth: element.getAttribute('colwidth') ? [Number(element.getAttribute('colwidth'))] : null
      };
    }
  }],
  toDOM(node): DOMOutputSpec {
    const attrs: Record<string, string> = {};
    if (node.attrs.colspan !== 1) attrs.colspan = node.attrs.colspan;
    if (node.attrs.rowspan !== 1) attrs.rowspan = node.attrs.rowspan;
    if (node.attrs.colwidth) attrs.colwidth = node.attrs.colwidth.join(',');
    return ['td', attrs, 0];
  }
};

const tableHeaderSpec: NodeSpec = {
  content: 'block+',
  attrs: {
    colspan: { default: 1 },
    rowspan: { default: 1 },
    colwidth: { default: null }
  },
  tableRole: 'header_cell',
  isolating: true,
  parseDOM: [{
    tag: 'th',
    getAttrs(dom) {
      const element = dom as HTMLElement;
      return {
        colspan: Number(element.getAttribute('colspan') || 1),
        rowspan: Number(element.getAttribute('rowspan') || 1),
        colwidth: element.getAttribute('colwidth') ? [Number(element.getAttribute('colwidth'))] : null
      };
    }
  }],
  toDOM(node): DOMOutputSpec {
    const attrs: Record<string, string> = {};
    if (node.attrs.colspan !== 1) attrs.colspan = node.attrs.colspan;
    if (node.attrs.rowspan !== 1) attrs.rowspan = node.attrs.rowspan;
    if (node.attrs.colwidth) attrs.colwidth = node.attrs.colwidth.join(',');
    return ['th', attrs, 0];
  }
};

// Create extended schema
const mySchema = new Schema({
  nodes: addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block')
    .append({
      task_list: taskListSpec,
      task_item: taskItemSpec,
      youtube: youtubeSpec,
      table: tableNodeSpec,
      table_row: tableRowSpec,
      table_cell: tableCellSpec,
      table_header: tableHeaderSpec,
    }),
  marks: basicSchema.spec.marks.addToEnd('strike', strikeSpec).addToEnd('underline', underlineSpec).addToEnd('link', linkSpec),
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

// Helper commands
function clearMarks(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const { from, to } = state.selection;
  if (dispatch) {
    const tr = state.tr;
    state.schema.marks && Object.keys(state.schema.marks).forEach(markName => {
      const markType = state.schema.marks[markName];
      tr.removeMark(from, to, markType);
    });
    dispatch(tr);
  }
  return true;
}

function clearNodes(state: EditorState, dispatch?: (tr: Transaction) => void) {
  return setBlockType(state.schema.nodes.paragraph)(state, dispatch);
}

function toggleLink(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView) {
  const { link } = state.schema.marks;
  if (!link) return false;

  const { from, to } = state.selection;
  const hasMark = state.doc.rangeHasMark(from, to, link);

  if (hasMark) {
    // Remove link
    if (dispatch) {
      dispatch(state.tr.removeMark(from, to, link));
    }
    return true;
  } else {
    // Add link
    const href = window.prompt('Enter link URL:', 'https://');
    if (href && href !== 'https://') {
      if (dispatch) {
        dispatch(state.tr.addMark(from, to, link.create({ href })));
      }
      if (view) view.focus();
      return true;
    }
    return false;
  }
}

function insertImage(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView) {
  const { image } = state.schema.nodes;
  if (!image) return false;

  const url = window.prompt('Enter image URL:');
  if (url) {
    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(image.create({ src: url })));
    }
    if (view) view.focus();
    return true;
  }
  return false;
}

function insertYoutube(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView) {
  const { youtube } = state.schema.nodes;
  if (!youtube) return false;

  let url = window.prompt('Enter YouTube URL:');
  if (url) {
    // Convert watch URL to embed URL
    if (url.includes('watch?v=')) {
      url = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      url = `https://www.youtube.com/embed/${videoId}`;
    }

    if (dispatch) {
      dispatch(state.tr.replaceSelectionWith(youtube.create({ src: url })));
    }
    if (view) view.focus();
    return true;
  }
  return false;
}

function insertTable(state: EditorState, dispatch?: (tr: Transaction) => void, view?: EditorView) {
  const { table, table_row, table_cell } = state.schema.nodes;
  if (!table || !table_row || !table_cell) return false;

  const rows = 3;
  const cols = 3;
  const cells = [];

  for (let i = 0; i < cols; i++) {
    cells.push(table_cell.createAndFill()!);
  }

  const rowNodes = [];
  for (let i = 0; i < rows; i++) {
    rowNodes.push(table_row.create(null, cells));
  }

  const tableNode = table.create(null, rowNodes);

  if (dispatch) {
    dispatch(state.tr.replaceSelectionWith(tableNode));
  }
  if (view) view.focus();
  return true;
}

function toggleTaskList(state: EditorState, dispatch?: (tr: Transaction) => void) {
  const { task_list, task_item } = state.schema.nodes;
  if (!task_list || !task_item) return false;

  return wrapInList(task_list)(state, dispatch);
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
          active={isMarkActive('strike')}
          onClick={() => toggleMarkCommand('strike')}
          title="Strikethrough"
        >
          Strike
        </ToolbarButton>
        <ToolbarButton
          active={isMarkActive('code')}
          onClick={() => toggleMarkCommand('code')}
          title="Code (Ctrl+`)"
        >
          Code
        </ToolbarButton>
        <ToolbarButton
          onClick={() => clearMarks(state, view.dispatch)}
          title="Clear marks"
        >
          Clear marks
        </ToolbarButton>
        <ToolbarButton
          onClick={() => clearNodes(state, view.dispatch)}
          title="Clear nodes"
        >
          Clear nodes
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
        <ToolbarButton
          active={isBlockActive('task_list')}
          onClick={() => toggleTaskList(state, view.dispatch)}
          title="Task List"
        >
          Task List
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton
          active={isMarkActive('link')}
          onClick={() => toggleLink(state, view.dispatch, view)}
          title="Link"
        >
          Link
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertImage(state, view.dispatch, view)}
          title="Image"
        >
          Image
        </ToolbarButton>
        <ToolbarButton
          onClick={() => insertYoutube(state, view.dispatch, view)}
          title="YouTube"
        >
          Youtube
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
        <ToolbarButton
          active={isBlockActive('table')}
          onClick={() => insertTable(state, view.dispatch, view)}
          title="Table"
        >
          Table
        </ToolbarButton>
      </div>

      <div className="toolbar-group">
        <ToolbarButton onClick={insertHorizontalRule} title="Horizontal Rule">
          Horizontal rule
        </ToolbarButton>
        <ToolbarButton onClick={insertHardBreak} title="Hard Break (Shift+Enter)">
          Hard break
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
          'Mod-u': toggleMark(mySchema.marks.underline),
          'Mod-`': toggleMark(mySchema.marks.code),
          'Shift-Enter': (state, dispatch) => {
            if (dispatch) {
              dispatch(state.tr.replaceSelectionWith(mySchema.nodes.hard_break.create()));
            }
            return true;
          },
          'Shift-Ctrl-8': wrapInList(mySchema.nodes.bullet_list),
          'Shift-Ctrl-9': wrapInList(mySchema.nodes.ordered_list),
          'Tab': goToNextCell(1),
          'Shift-Tab': goToNextCell(-1),
          'Enter': chainCommands(
            newlineInCode,
            (state, dispatch) => {
              const { $from } = state.selection;
              const listItemType = mySchema.nodes.list_item;
              const taskItemType = mySchema.nodes.task_item;

              // Check if we're in a list item
              for (let d = $from.depth; d >= 0; d--) {
                if ($from.node(d).type === listItemType) {
                  if ($from.parent.content.size === 0) {
                    return liftListItem(listItemType)(state, dispatch);
                  }
                  break;
                }
                if ($from.node(d).type === taskItemType) {
                  if ($from.parent.content.size === 0) {
                    return liftListItem(taskItemType)(state, dispatch);
                  }
                  break;
                }
              }
              return false;
            },
            createParagraphNear,
            liftEmptyBlock,
            splitBlock
          ),
        }),
        keymap(baseKeymap),
        columnResizing(),
        tableEditing(),
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
