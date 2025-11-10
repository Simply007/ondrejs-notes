import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEditor, Editor, Element as SlateElement, Transforms, Text } from 'slate';
import type { Descendant, BaseEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import type { RenderLeafProps, RenderElementProps } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import './SlateArea.css';

// Type definitions
type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
};

type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

type HeadingElement = {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: Descendant[];
};

type BlockquoteElement = {
  type: 'blockquote';
  children: Descendant[];
};

type CodeBlockElement = {
  type: 'code-block';
  children: Descendant[];
};

type BulletedListElement = {
  type: 'bulleted-list';
  children: ListItemElement[];
};

type NumberedListElement = {
  type: 'numbered-list';
  children: ListItemElement[];
};

type ListItemElement = {
  type: 'list-item';
  children: Descendant[];
};

type LinkElement = {
  type: 'link';
  url: string;
  children: Descendant[];
};

type CustomElement =
  | ParagraphElement
  | HeadingElement
  | BlockquoteElement
  | CodeBlockElement
  | BulletedListElement
  | NumberedListElement
  | ListItemElement
  | LinkElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

// HTML serialization
const serialize = (nodes: Descendant[]): string => {
  return nodes.map(node => serializeNode(node)).join('');
};

const serializeNode = (node: Descendant): string => {
  if (Text.isText(node)) {
    let text = node.text;
    if (node.bold) text = `<strong>${text}</strong>`;
    if (node.italic) text = `<em>${text}</em>`;
    if (node.underline) text = `<u>${text}</u>`;
    if (node.strikethrough) text = `<s>${text}</s>`;
    if (node.code) text = `<code>${text}</code>`;
    return text || '';
  }

  const children = node.children.map(n => serializeNode(n)).join('');

  switch (node.type) {
    case 'paragraph':
      return `<p>${children}</p>`;
    case 'heading':
      return `<h${node.level}>${children}</h${node.level}>`;
    case 'blockquote':
      return `<blockquote>${children}</blockquote>`;
    case 'code-block':
      return `<pre><code>${children}</code></pre>`;
    case 'bulleted-list':
      return `<ul>${children}</ul>`;
    case 'numbered-list':
      return `<ol>${children}</ol>`;
    case 'list-item':
      return `<li>${children}</li>`;
    case 'link':
      return `<a href="${node.url}">${children}</a>`;
    default:
      return children;
  }
};

// HTML deserialization
const deserialize = (html: string): Descendant[] => {
  const document = new DOMParser().parseFromString(html, 'text/html');
  return deserializeNode(document.body);
};

const deserializeNode = (el: HTMLElement): Descendant[] => {
  if (el.nodeType === Node.TEXT_NODE) {
    return [{ text: el.textContent || '' }];
  }

  if (el.nodeType !== Node.ELEMENT_NODE) {
    return [{ text: '' }];
  }

  const children: Descendant[] = Array.from(el.childNodes)
    .flatMap(node => deserializeNode(node as HTMLElement));

  if (children.length === 0) {
    children.push({ text: '' });
  }

  switch (el.nodeName) {
    case 'BODY':
      return children;
    case 'BR':
      return [{ text: '\n' }];
    case 'P':
      return [{ type: 'paragraph', children }];
    case 'H1':
      return [{ type: 'heading', level: 1, children }];
    case 'H2':
      return [{ type: 'heading', level: 2, children }];
    case 'H3':
      return [{ type: 'heading', level: 3, children }];
    case 'H4':
      return [{ type: 'heading', level: 4, children }];
    case 'H5':
      return [{ type: 'heading', level: 5, children }];
    case 'H6':
      return [{ type: 'heading', level: 6, children }];
    case 'BLOCKQUOTE':
      return [{ type: 'blockquote', children }];
    case 'PRE':
      return [{ type: 'code-block', children }];
    case 'UL':
      return [{ type: 'bulleted-list', children: children.map(child =>
        SlateElement.isElement(child) && child.type === 'list-item'
          ? child
          : { type: 'list-item', children: [child] }
      ) }];
    case 'OL':
      return [{ type: 'numbered-list', children: children.map(child =>
        SlateElement.isElement(child) && child.type === 'list-item'
          ? child
          : { type: 'list-item', children: [child] }
      ) }];
    case 'LI':
      return [{ type: 'list-item', children }];
    case 'A':
      return [{ type: 'link', url: (el as HTMLAnchorElement).href, children }];
    case 'STRONG':
    case 'B':
      return children.map(child => Text.isText(child) ? { ...child, bold: true } : child);
    case 'EM':
    case 'I':
      return children.map(child => Text.isText(child) ? { ...child, italic: true } : child);
    case 'U':
      return children.map(child => Text.isText(child) ? { ...child, underline: true } : child);
    case 'S':
    case 'STRIKE':
      return children.map(child => Text.isText(child) ? { ...child, strikethrough: true } : child);
    case 'CODE':
      return children.map(child => Text.isText(child) ? { ...child, code: true } : child);
    default:
      return children;
  }
};

// Helper functions
const isMarkActive = (editor: Editor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
};

const toggleMark = (editor: Editor, format: keyof Omit<CustomText, 'text'>) => {
  const isActive = isMarkActive(editor, format);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof typeof n] === format,
    })
  );

  return !!match;
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = ['numbered-list', 'bulleted-list'].includes(format);

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['numbered-list', 'bulleted-list'].includes(n.type),
    split: true,
  });

  let newProperties: Partial<SlateElement>;
  if (isActive) {
    newProperties = { type: 'paragraph' };
  } else if (isList) {
    newProperties = { type: 'list-item' };
  } else {
    newProperties = { type: format } as Partial<SlateElement>;
  }

  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] } as SlateElement;
    Transforms.wrapNodes(editor, block);
  }
};

const toggleHeading = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const isActive = isBlockActive(editor, 'heading') &&
    Editor.nodes(editor, {
      match: n => SlateElement.isElement(n) && n.type === 'heading' && n.level === level,
    }).next().value;

  Transforms.setNodes<SlateElement>(
    editor,
    isActive
      ? { type: 'paragraph' }
      : { type: 'heading', level }
  );
};

const insertLink = (editor: Editor, url: string) => {
  if (editor.selection) {
    wrapLink(editor, url);
  }
};

const isLinkActive = (editor: Editor) => {
  const [link] = Array.from(
    Editor.nodes(editor, {
      match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
    })
  );
  return !!link;
};

const unwrapLink = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  });
};

const wrapLink = (editor: Editor, url: string) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor);
  }

  const { selection } = editor;
  const isCollapsed = selection && selection.anchor.offset === selection.focus.offset;
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  };

  if (isCollapsed) {
    Transforms.insertNodes(editor, link);
  } else {
    Transforms.wrapNodes(editor, link, { split: true });
    Transforms.collapse(editor, { edge: 'end' });
  }
};

// Render components
const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'heading': {
      const Tag = `h${element.level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      return <Tag {...attributes}>{children}</Tag>;
    }
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>;
    case 'code-block':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      );
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>;
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>;
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    case 'link':
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  return <span {...attributes}>{children}</span>;
};

// Toolbar component
const Toolbar = ({ editor }: { editor: Editor }) => {
  const [, forceUpdate] = useState({});

  // Force re-render when selection changes to update button states
  useEffect(() => {
    const handleSelectionChange = () => {
      forceUpdate({});
    };
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'bold');
          }}
          className={isMarkActive(editor, 'bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'italic');
          }}
          className={isMarkActive(editor, 'italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'underline');
          }}
          className={isMarkActive(editor, 'underline') ? 'is-active' : ''}
        >
          Underline
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'strikethrough');
          }}
          className={isMarkActive(editor, 'strikethrough') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleMark(editor, 'code');
          }}
          className={isMarkActive(editor, 'code') ? 'is-active' : ''}
        >
          Code
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'paragraph');
          }}
          className={isBlockActive(editor, 'paragraph') ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 1);
          }}
          className={isBlockActive(editor, 'heading') ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 2);
          }}
          className={isBlockActive(editor, 'heading') ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 3);
          }}
          className={isBlockActive(editor, 'heading') ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 4);
          }}
          className={isBlockActive(editor, 'heading') ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 5);
          }}
          className={isBlockActive(editor, 'heading') ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 6);
          }}
          className={isBlockActive(editor, 'heading') ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'bulleted-list');
          }}
          className={isBlockActive(editor, 'bulleted-list') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'numbered-list');
          }}
          className={isBlockActive(editor, 'numbered-list') ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt('Enter link URL:', 'https://');
            if (url && url !== 'https://') {
              insertLink(editor, url);
            }
          }}
          className={isLinkActive(editor) ? 'is-active' : ''}
        >
          Link
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'code-block');
          }}
          className={isBlockActive(editor, 'code-block') ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleBlock(editor, 'blockquote');
          }}
          className={isBlockActive(editor, 'blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
      </div>
    </div>
  );
};

// Main component
export default function SlateArea({
  documentId,
  content,
  onChange
}: {
  documentId: string;
  content: string;
  onChange: (newContent: string) => void;
}) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue = useMemo(() => {
    if (content && content.trim() !== '') {
      try {
        const parsed = deserialize(content);
        return parsed.length > 0 ? parsed : [{ type: 'paragraph', children: [{ text: '' }] } as Descendant];
      } catch (e) {
        console.error('Failed to parse content:', e);
        return [{ type: 'paragraph', children: [{ text: '' }] } as Descendant];
      }
    }
    return [{ type: 'paragraph', children: [{ text: '' }] } as Descendant];
  }, [content]);

  const handleChange = useCallback((newValue: Descendant[]) => {
    const html = serialize(newValue);
    onChange(html);
  }, [onChange]);

  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);

  return (
    <div className="slate-container" data-document-id={documentId}>
      <Slate editor={editor} initialValue={initialValue} onChange={handleChange}>
        <Toolbar editor={editor} />
        <div className="slate-editor-wrapper">
          <Editable
            className="slate-editable"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            placeholder="Type something..."
            spellCheck
            autoFocus
          />
        </div>
      </Slate>
    </div>
  );
}
