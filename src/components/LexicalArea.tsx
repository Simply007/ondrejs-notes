import { useEffect, useState } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { ListItemNode, ListNode } from '@lexical/list';
import { CodeNode, CodeHighlightNode } from '@lexical/code';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { TableNode, TableCellNode, TableRowNode } from '@lexical/table';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $generateHtmlFromNodes, $generateNodesFromDOM } from '@lexical/html';
import { HorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';
import {
  $getRoot,
  $getSelection,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  $isRangeSelection,
  $createTextNode,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  $isTextNode
} from 'lexical';
import type { LexicalCommand } from 'lexical';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND
} from '@lexical/list';
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode
} from '@lexical/rich-text';
import {
  $setBlocksType
} from '@lexical/selection';
import { $createCodeNode, $isCodeNode } from '@lexical/code';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $createHorizontalRuleNode } from '@lexical/react/LexicalHorizontalRuleNode';

import './LexicalArea.css';

// Custom commands
const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> = createCommand('INSERT_HORIZONTAL_RULE_COMMAND');

// Lexical editor theme configuration
const theme = {
  paragraph: 'lexical-paragraph',
  quote: 'lexical-quote',
  heading: {
    h1: 'lexical-h1',
    h2: 'lexical-h2',
    h3: 'lexical-h3',
    h4: 'lexical-h4',
    h5: 'lexical-h5',
    h6: 'lexical-h6'
  },
  list: {
    nested: {
      listitem: 'lexical-nested-listitem'
    },
    ol: 'lexical-list-ol',
    ul: 'lexical-list-ul',
    listitem: 'lexical-listitem',
    checklist: 'lexical-checklist'
  },
  code: 'lexical-code',
  codeHighlight: {
    atrule: 'lexical-token-atrule',
    attr: 'lexical-token-attr',
    boolean: 'lexical-token-boolean',
    builtin: 'lexical-token-builtin',
    cdata: 'lexical-token-cdata',
    char: 'lexical-token-char',
    class: 'lexical-token-class',
    'class-name': 'lexical-token-class-name',
    comment: 'lexical-token-comment',
    constant: 'lexical-token-constant',
    deleted: 'lexical-token-deleted',
    doctype: 'lexical-token-doctype',
    entity: 'lexical-token-entity',
    function: 'lexical-token-function',
    important: 'lexical-token-important',
    inserted: 'lexical-token-inserted',
    keyword: 'lexical-token-keyword',
    namespace: 'lexical-token-namespace',
    number: 'lexical-token-number',
    operator: 'lexical-token-operator',
    prolog: 'lexical-token-prolog',
    property: 'lexical-token-property',
    punctuation: 'lexical-token-punctuation',
    regex: 'lexical-token-regex',
    selector: 'lexical-token-selector',
    string: 'lexical-token-string',
    symbol: 'lexical-token-symbol',
    tag: 'lexical-token-tag',
    url: 'lexical-token-url',
    variable: 'lexical-token-variable'
  },
  text: {
    bold: 'lexical-text-bold',
    code: 'lexical-text-code',
    italic: 'lexical-text-italic',
    strikethrough: 'lexical-text-strikethrough',
    subscript: 'lexical-text-subscript',
    superscript: 'lexical-text-superscript',
    underline: 'lexical-text-underline'
  },
  table: 'lexical-table',
  tableCell: 'lexical-table-cell',
  tableCellHeader: 'lexical-table-cell-header'
};

// Plugin to sync content changes to parent component
function OnChangePlugin({ onChange }: { onChange: (html: string) => void }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const htmlString = $generateHtmlFromNodes(editor, null);
        onChange(htmlString);
      });
    });
  }, [editor, onChange]);

  return null;
}

// Plugin to load initial content
function InitialContentPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (content && content.trim() !== '') {
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);

        const root = $getRoot();
        root.clear();

        if (nodes.length > 0) {
          nodes.forEach(node => {
            root.append(node);
          });
        } else {
          root.append($createParagraphNode());
        }
      });
    }
  }, []);

  return null;
}

// Plugin for custom commands
function CommandsPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerCommand(
      INSERT_HORIZONTAL_RULE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const focusNode = selection.focus.getNode();
          if (focusNode !== null) {
            const hrNode = $createHorizontalRuleNode();
            selection.insertNodes([hrNode]);
          }
        }
        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}

// Toolbar component matching TipTap's structure
function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [isLink, setIsLink] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      CAN_UNDO_COMMAND,
      (payload) => {
        setCanUndo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      CAN_REDO_COMMAND,
      (payload) => {
        setCanRedo(payload);
        return false;
      },
      1
    );
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if (!selection || !$isRangeSelection(selection)) return;

        // Update text formatting states
        setIsBold(selection.hasFormat('bold'));
        setIsItalic(selection.hasFormat('italic'));
        setIsStrikethrough(selection.hasFormat('strikethrough'));
        setIsCode(selection.hasFormat('code'));

        // Update block type
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();

        if ($isHeadingNode(element)) {
          setBlockType(element.getTag());
        } else if ($isCodeNode(element)) {
          setBlockType('code');
        } else if ($isQuoteNode(element)) {
          setBlockType('quote');
        } else {
          setBlockType(element.getType());
        }

        // Check if selection is inside a link
        const node = selection.anchor.getNode();
        const parent = node.getParent();
        setIsLink($isLinkNode(parent) || $isLinkNode(node));
      });
    });
  }, [editor]);

  const formatHeading = (headingSize: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6') => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection !== null) {
        $setBlocksType(selection, () => $createHeadingNode(headingSize));
      }
    });
  };

  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection !== null) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatCodeBlock = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection !== null) {
        $setBlocksType(selection, () => $createCodeNode());
      }
    });
  };

  const formatQuote = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection !== null) {
        $setBlocksType(selection, () => $createQuoteNode());
      }
    });
  };

  const insertLink = () => {
    const url = window.prompt('Enter link URL', isLink ? 'https://' : '');
    if (url === null) return;

    if (url === '') {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const insertImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const paragraph = $createParagraphNode();
          const imageHtml = `<img src="${url}" alt="Image" style="max-width: 100%; height: auto;" />`;
          const parser = new DOMParser();
          const dom = parser.parseFromString(imageHtml, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          nodes.forEach(node => paragraph.append(node));
          selection.insertNodes([paragraph]);
        }
      });
    }
  };

  const insertYoutube = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const paragraph = $createParagraphNode();
          // Create a simple YouTube embed - in production you'd want to extract video ID
          const youtubeHtml = `<div data-youtube-video><iframe src="${url.replace('watch?v=', 'embed/')}" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>`;
          const parser = new DOMParser();
          const dom = parser.parseFromString(youtubeHtml, 'text/html');
          const nodes = $generateNodesFromDOM(editor, dom);
          nodes.forEach(node => paragraph.append(node));
          selection.insertNodes([paragraph]);
        }
      });
    }
  };

  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach(node => {
          if ($isTextNode(node)) {
            node.setFormat(0);
          }
        });
      }
    });
  };

  const clearNodes = () => {
    formatParagraph();
  };

  const insertHardBreak = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const br = $createTextNode('\n');
        selection.insertNodes([br]);
      }
    });
  };

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
          className={isBold ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
          className={isItalic ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough')}
          className={isStrikethrough ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code')}
          className={isCode ? 'is-active' : ''}
        >
          Code
        </button>
        <button onClick={clearFormatting}>Clear marks</button>
        <button onClick={clearNodes}>Clear nodes</button>
        <button
          onClick={formatParagraph}
          className={blockType === 'paragraph' ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => formatHeading('h1')}
          className={blockType === 'h1' ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => formatHeading('h2')}
          className={blockType === 'h2' ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => formatHeading('h3')}
          className={blockType === 'h3' ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => formatHeading('h4')}
          className={blockType === 'h4' ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => formatHeading('h5')}
          className={blockType === 'h5' ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => formatHeading('h6')}
          className={blockType === 'h6' ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
          className={blockType === 'bullet' ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
          className={blockType === 'number' ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)}
          className={blockType === 'check' ? 'is-active' : ''}
        >
          Task list
        </button>
        <button
          onClick={insertLink}
          className={isLink ? 'is-active' : ''}
        >
          Link
        </button>
        <button onClick={insertImage}>
          Image
        </button>
        <button onClick={insertYoutube}>
          Youtube
        </button>
        <button
          onClick={formatCodeBlock}
          className={blockType === 'code' ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { rows: '3', columns: '3' })}
        >
          Table
        </button>
        <button
          onClick={formatQuote}
          className={blockType === 'quote' ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button
          onClick={() => editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)}
        >
          Horizontal rule
        </button>
        <button onClick={insertHardBreak}>
          Hard break
        </button>
        <button
          onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          disabled={!canUndo}
        >
          Undo
        </button>
        <button
          onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          disabled={!canRedo}
        >
          Redo
        </button>
      </div>
    </div>
  );
}

export default function LexicalArea({
  documentId,
  content,
  onChange
}: {
  documentId: string;
  content: string;
  onChange: (newContent: string) => void;
}) {
  const initialConfig = {
    namespace: 'LexicalEditor',
    theme,
    onError: (error: Error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      HorizontalRuleNode
    ]
  };

  return (
    <div className="editor-wrapper" data-document-id={documentId}>
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <div className="lexical-editor-container">
          <RichTextPlugin
            contentEditable={<ContentEditable className="lexical-content-editable" />}
            placeholder={<div className="lexical-placeholder">Type something...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <TablePlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <OnChangePlugin onChange={onChange} />
          <InitialContentPlugin content={content} />
          <CommandsPlugin />
        </div>
      </LexicalComposer>
    </div>
  );
}
