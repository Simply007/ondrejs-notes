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

type ImageElement = {
  type: 'image';
  url: string;
  children: Descendant[];
};

type HorizontalRuleElement = {
  type: 'horizontal-rule';
  children: Descendant[];
};

type TableElement = {
  type: 'table';
  children: TableRowElement[];
};

type TableRowElement = {
  type: 'table-row';
  children: TableCellElement[];
};

type TableCellElement = {
  type: 'table-cell';
  children: Descendant[];
};

type TaskListElement = {
  type: 'task-list';
  children: TaskItemElement[];
};

type TaskItemElement = {
  type: 'task-item';
  checked: boolean;
  children: Descendant[];
};

type YoutubeElement = {
  type: 'youtube';
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
  | LinkElement
  | ImageElement
  | HorizontalRuleElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TaskListElement
  | TaskItemElement
  | YoutubeElement;

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
    case 'image':
      return `<img src="${node.url}" alt="Image" />`;
    case 'horizontal-rule':
      return '<hr />';
    case 'table':
      return `<table>${children}</table>`;
    case 'table-row':
      return `<tr>${children}</tr>`;
    case 'table-cell':
      return `<td>${children}</td>`;
    case 'task-list':
      return `<ul data-task-list="true">${children}</ul>`;
    case 'task-item':
      return `<li data-task-item="true" data-checked="${node.checked}"><input type="checkbox" ${node.checked ? 'checked' : ''} />${children}</li>`;
    case 'youtube':
      return `<div data-youtube-video><iframe src="${node.url}" width="640" height="360" frameborder="0" allowfullscreen></iframe></div>`;
    default:
      return children;
  }
};

// HTML deserialization
const deserialize = (html: string): Descendant[] => {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const nodes = deserializeNode(document.body);

  // Ensure we always have at least one valid block element
  if (nodes.length === 0) {
    return [{ type: 'paragraph', children: [{ text: '' }] } as Descendant];
  }

  // Flatten and clean up the structure
  return nodes.filter(node => {
    if (SlateElement.isElement(node)) {
      return true;
    }
    // If it's a text node at root level, wrap it in a paragraph
    return false;
  });
};

const deserializeNode = (el: HTMLElement): Descendant[] => {
  if (el.nodeType === Node.TEXT_NODE) {
    return [{ text: el.textContent || '' }];
  }

  if (el.nodeType !== Node.ELEMENT_NODE) {
    return [{ text: '' }];
  }

  // For these block elements, we need to separate inline and block children
  const isBlockContainer = ['BODY', 'P', 'DIV'].includes(el.nodeName);

  if (isBlockContainer && el.nodeName !== 'DIV') {
    // Separate inline content from block elements
    const inlineContent: Descendant[] = [];
    const result: Descendant[] = [];

    for (const child of Array.from(el.childNodes)) {
      const childEl = child as HTMLElement;
      const childNodes = deserializeNode(childEl);

      // Check if this child is a block element
      const isBlockChild = childNodes.some(node =>
        SlateElement.isElement(node) &&
        ['paragraph', 'heading', 'blockquote', 'code-block', 'bulleted-list', 'numbered-list', 'image', 'horizontal-rule', 'table', 'task-list', 'youtube'].includes(node.type)
      );

      if (isBlockChild) {
        // If we have accumulated inline content, wrap it in a paragraph
        if (inlineContent.length > 0 && inlineContent.some(n => Text.isText(n) && n.text.trim() !== '')) {
          if (el.nodeName === 'P') {
            result.push({ type: 'paragraph', children: inlineContent } as Descendant);
          }
          inlineContent.length = 0;
        }
        // Add the block element
        result.push(...childNodes);
      } else {
        // Accumulate inline content
        inlineContent.push(...childNodes);
      }
    }

    // Handle remaining inline content
    if (inlineContent.length > 0) {
      if (el.nodeName === 'BODY') {
        // Wrap in paragraph for body
        result.push({ type: 'paragraph', children: inlineContent } as Descendant);
      } else if (el.nodeName === 'P') {
        // Already in paragraph, return the inline content wrapped
        return [{ type: 'paragraph', children: inlineContent } as Descendant];
      }
    }

    return result.length > 0 ? result : [{ type: 'paragraph', children: [{ text: '' }] } as Descendant];
  }

  // For other elements, process normally
  const childNodes = Array.from(el.childNodes)
    .flatMap(node => deserializeNode(node as HTMLElement));

  const elementChildren = childNodes.length === 0 ? [{ text: '' }] : childNodes;

  switch (el.nodeName) {
    case 'BODY':
      return elementChildren;
    case 'BR':
      return [{ text: '\n' }];
    case 'P': {
      // Check if elementChildren contains block elements
      const hasBlockChildren = elementChildren.some(child =>
        SlateElement.isElement(child) &&
        ['paragraph', 'heading', 'blockquote', 'code-block', 'bulleted-list', 'numbered-list', 'image', 'horizontal-rule', 'table', 'task-list', 'youtube'].includes(child.type)
      );

      // If there are block children, return them unwrapped (don't nest blocks in paragraphs)
      if (hasBlockChildren) {
        const result: Descendant[] = [];
        const inlineContent: Descendant[] = [];

        elementChildren.forEach(child => {
          if (SlateElement.isElement(child) &&
              ['paragraph', 'heading', 'blockquote', 'code-block', 'bulleted-list', 'numbered-list', 'image', 'horizontal-rule', 'table', 'task-list', 'youtube'].includes(child.type)) {
            // If we have accumulated inline content, wrap it in a paragraph
            if (inlineContent.length > 0 && inlineContent.some(n => Text.isText(n) && n.text.trim() !== '')) {
              result.push({ type: 'paragraph', children: inlineContent.slice() } as Descendant);
              inlineContent.length = 0;
            }
            // Add the block element
            result.push(child);
          } else {
            // Accumulate inline content
            inlineContent.push(child);
          }
        });

        // Handle remaining inline content
        if (inlineContent.length > 0 && inlineContent.some(n => Text.isText(n) && n.text.trim() !== '')) {
          result.push({ type: 'paragraph', children: inlineContent } as Descendant);
        }

        return result.length > 0 ? result : [{ type: 'paragraph', children: [{ text: '' }] } as Descendant];
      }

      // No block children, return a normal paragraph
      return [{ type: 'paragraph', children: elementChildren }];
    }
    case 'H1':
      return [{ type: 'heading', level: 1, children: elementChildren }];
    case 'H2':
      return [{ type: 'heading', level: 2, children: elementChildren }];
    case 'H3':
      return [{ type: 'heading', level: 3, children: elementChildren }];
    case 'H4':
      return [{ type: 'heading', level: 4, children: elementChildren }];
    case 'H5':
      return [{ type: 'heading', level: 5, children: elementChildren }];
    case 'H6':
      return [{ type: 'heading', level: 6, children: elementChildren }];
    case 'BLOCKQUOTE':
      return [{ type: 'blockquote', children: elementChildren }];
    case 'PRE':
      return [{ type: 'code-block', children: elementChildren }];
    case 'UL':
      if (el.getAttribute('data-task-list') === 'true') {
        return [{ type: 'task-list', children: elementChildren.map(child =>
          SlateElement.isElement(child) && child.type === 'task-item'
            ? child
            : { type: 'task-item', checked: false, children: [child] }
        ) }];
      }
      return [{ type: 'bulleted-list', children: elementChildren.map(child =>
        SlateElement.isElement(child) && child.type === 'list-item'
          ? child
          : { type: 'list-item', children: [child] }
      ) }];
    case 'OL':
      return [{ type: 'numbered-list', children: elementChildren.map(child =>
        SlateElement.isElement(child) && child.type === 'list-item'
          ? child
          : { type: 'list-item', children: [child] }
      ) }];
    case 'LI':
      if (el.getAttribute('data-task-item') === 'true') {
        const checked = el.getAttribute('data-checked') === 'true';
        return [{ type: 'task-item', checked, children: elementChildren }];
      }
      return [{ type: 'list-item', children: elementChildren }];
    case 'A':
      return [{ type: 'link', url: (el as HTMLAnchorElement).href, children: elementChildren }];
    case 'IMG':
      return [{ type: 'image', url: (el as HTMLImageElement).src, children: [{ text: '' }] }];
    case 'HR':
      return [{ type: 'horizontal-rule', children: [{ text: '' }] }];
    case 'TABLE':
      return [{ type: 'table', children: elementChildren.filter(child =>
        SlateElement.isElement(child) && child.type === 'table-row'
      ) as TableRowElement[] }];
    case 'TR':
      return [{ type: 'table-row', children: elementChildren.filter(child =>
        SlateElement.isElement(child) && child.type === 'table-cell'
      ) as TableCellElement[] }];
    case 'TD':
    case 'TH':
      return [{ type: 'table-cell', children: elementChildren }];
    case 'DIV':
      if (el.getAttribute('data-youtube-video') !== null) {
        const iframe = el.querySelector('iframe');
        const url = iframe?.getAttribute('src') || '';
        return [{ type: 'youtube', url, children: [{ text: '' }] }];
      }
      return elementChildren;
    case 'STRONG':
    case 'B':
      return elementChildren.map(child => Text.isText(child) ? { ...child, bold: true } : child);
    case 'EM':
    case 'I':
      return elementChildren.map(child => Text.isText(child) ? { ...child, italic: true } : child);
    case 'U':
      return elementChildren.map(child => Text.isText(child) ? { ...child, underline: true } : child);
    case 'S':
    case 'STRIKE':
      return elementChildren.map(child => Text.isText(child) ? { ...child, strikethrough: true } : child);
    case 'CODE':
      return elementChildren.map(child => Text.isText(child) ? { ...child, code: true } : child);
    default:
      return elementChildren;
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

const isHeadingActive = (editor: Editor, level: 1 | 2 | 3 | 4 | 5 | 6) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n.type === 'heading' &&
        n.level === level,
    })
  );

  return !!match;
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

const insertImage = (editor: Editor, url: string) => {
  const image: ImageElement = {
    type: 'image',
    url,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, image);
};

const insertHorizontalRule = (editor: Editor) => {
  const hr: HorizontalRuleElement = {
    type: 'horizontal-rule',
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, hr);
};

const insertHardBreak = (editor: Editor) => {
  Transforms.insertText(editor, '\n');
};

const insertTable = (editor: Editor) => {
  const table: TableElement = {
    type: 'table',
    children: Array.from({ length: 3 }, () => ({
      type: 'table-row',
      children: Array.from({ length: 3 }, () => ({
        type: 'table-cell',
        children: [{ type: 'paragraph', children: [{ text: '' }] }],
      })),
    })),
  };
  Transforms.insertNodes(editor, table as SlateElement);
};

const toggleTaskList = (editor: Editor) => {
  const isActive = isBlockActive(editor, 'task-list');

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['task-list', 'bulleted-list', 'numbered-list'].includes(n.type),
    split: true,
  });

  if (!isActive) {
    const taskItem: TaskItemElement = {
      type: 'task-item',
      checked: false,
      children: [],
    };

    Transforms.setNodes(editor, taskItem as Partial<SlateElement>);

    const taskList: TaskListElement = {
      type: 'task-list',
      children: [],
    };
    Transforms.wrapNodes(editor, taskList as SlateElement);
  } else {
    Transforms.setNodes(editor, { type: 'paragraph' } as Partial<SlateElement>);
  }
};

const insertYoutube = (editor: Editor, url: string) => {
  // Convert watch URL to embed URL
  let embedUrl = url;
  if (url.includes('watch?v=')) {
    embedUrl = url.replace('watch?v=', 'embed/');
  } else if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1];
    embedUrl = `https://www.youtube.com/embed/${videoId}`;
  }

  const youtube: YoutubeElement = {
    type: 'youtube',
    url: embedUrl,
    children: [{ text: '' }],
  };
  Transforms.insertNodes(editor, youtube);
};

const clearMarks = (editor: Editor) => {
  Editor.removeMark(editor, 'bold');
  Editor.removeMark(editor, 'italic');
  Editor.removeMark(editor, 'underline');
  Editor.removeMark(editor, 'strikethrough');
  Editor.removeMark(editor, 'code');
};

const clearNodes = (editor: Editor) => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      ['bulleted-list', 'numbered-list', 'task-list'].includes(n.type),
    split: true,
  });
  Transforms.setNodes(editor, { type: 'paragraph' } as Partial<SlateElement>);
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
    case 'image':
      return (
        <div {...attributes} contentEditable={false}>
          <img src={element.url} alt="Content" style={{ maxWidth: '100%', height: 'auto' }} />
          {children}
        </div>
      );
    case 'horizontal-rule':
      return (
        <div {...attributes} contentEditable={false}>
          <hr />
          {children}
        </div>
      );
    case 'table':
      return (
        <table {...attributes}>
          <tbody>{children}</tbody>
        </table>
      );
    case 'table-row':
      return <tr {...attributes}>{children}</tr>;
    case 'table-cell':
      return <td {...attributes}>{children}</td>;
    case 'task-list':
      return <ul {...attributes} className="task-list">{children}</ul>;
    case 'task-item':
      return (
        <li {...attributes} className="task-item">
          <span contentEditable={false} style={{ marginRight: '0.5em' }}>
            <input
              type="checkbox"
              checked={element.checked}
              onChange={() => {
                // This will be handled by the editor
              }}
            />
          </span>
          {children}
        </li>
      );
    case 'youtube':
      return (
        <div {...attributes} contentEditable={false} className="youtube-embed">
          <iframe
            src={element.url}
            width="640"
            height="360"
            style={{ border: 0 }}
            allowFullScreen
            title="YouTube video"
          />
          {children}
        </div>
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
            clearMarks(editor);
          }}
        >
          Clear marks
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            clearNodes(editor);
          }}
        >
          Clear nodes
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
          className={isHeadingActive(editor, 1) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 2);
          }}
          className={isHeadingActive(editor, 2) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 3);
          }}
          className={isHeadingActive(editor, 3) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 4);
          }}
          className={isHeadingActive(editor, 4) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 5);
          }}
          className={isHeadingActive(editor, 5) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            toggleHeading(editor, 6);
          }}
          className={isHeadingActive(editor, 6) ? 'is-active' : ''}
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
            toggleTaskList(editor);
          }}
          className={isBlockActive(editor, 'task-list') ? 'is-active' : ''}
        >
          Task list
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
            const url = window.prompt('Enter image URL:');
            if (url) {
              insertImage(editor, url);
            }
          }}
        >
          Image
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            const url = window.prompt('Enter YouTube URL:');
            if (url) {
              insertYoutube(editor, url);
            }
          }}
        >
          Youtube
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
            insertTable(editor);
          }}
        >
          Table
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
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            insertHorizontalRule(editor);
          }}
        >
          Horizontal rule
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            insertHardBreak(editor);
          }}
        >
          Hard break
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor.undo();
          }}
        >
          Undo
        </button>
        <button
          onMouseDown={(e) => {
            e.preventDefault();
            editor.redo();
          }}
        >
          Redo
        </button>
      </div>
    </div>
  );
};

// Configure editor to handle void elements
const withVoidElements = (editor: Editor) => {
  const { isVoid } = editor;

  editor.isVoid = element => {
    return ['image', 'horizontal-rule', 'youtube'].includes((element as SlateElement).type)
      ? true
      : isVoid(element);
  };

  return editor;
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
  const editor = useMemo(
    () => withVoidElements(withHistory(withReact(createEditor()))),
    []
  );

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
