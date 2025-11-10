import { useCallback } from 'react';
import { Remirror, useRemirror, useCommands, useActive, useChainedCommands, OnChangeHTML } from '@remirror/react';
import {
  BoldExtension,
  ItalicExtension,
  UnderlineExtension,
  StrikeExtension,
  CodeExtension,
  HeadingExtension,
  BlockquoteExtension,
  BulletListExtension,
  OrderedListExtension,
  TaskListExtension,
  LinkExtension,
  ImageExtension,
  CodeBlockExtension,
  HardBreakExtension,
  HorizontalRuleExtension,
  HistoryExtension,
  PlaceholderExtension,
  DropCursorExtension,
  GapCursorExtension,
  TableExtension,
} from 'remirror/extensions';

import './RemirrorArea.css';

interface MenuBarProps {
  documentId: string;
}

function MenuBar({ documentId }: MenuBarProps) {
  const commands = useCommands();
  const chain = useChainedCommands();
  const active = useActive();

  return (
    <div className="control-group" data-document-id={documentId}>
      <div className="button-group">
        <button
          onClick={() => commands.toggleBold()}
          className={active.bold() ? 'is-active' : ''}
          disabled={!commands.toggleBold.enabled()}
        >
          Bold
        </button>
        <button
          onClick={() => commands.toggleItalic()}
          className={active.italic() ? 'is-active' : ''}
          disabled={!commands.toggleItalic.enabled()}
        >
          Italic
        </button>
        <button
          onClick={() => commands.toggleStrike()}
          className={active.strike() ? 'is-active' : ''}
          disabled={!commands.toggleStrike.enabled()}
        >
          Strike
        </button>
        <button
          onClick={() => commands.toggleCode()}
          className={active.code() ? 'is-active' : ''}
          disabled={!commands.toggleCode.enabled()}
        >
          Code
        </button>
        <button
          onClick={() => chain.clearNodes().run()}
        >
          Clear nodes
        </button>
        <button
          onClick={() => chain.setParagraph().run()}
          className={active.paragraph() ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 1 })}
          className={active.heading({ level: 1 }) ? 'is-active' : ''}
          disabled={!commands.toggleHeading.enabled({ level: 1 })}
        >
          H1
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 2 })}
          className={active.heading({ level: 2 }) ? 'is-active' : ''}
          disabled={!commands.toggleHeading.enabled({ level: 2 })}
        >
          H2
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 3 })}
          className={active.heading({ level: 3 }) ? 'is-active' : ''}
          disabled={!commands.toggleHeading.enabled({ level: 3 })}
        >
          H3
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 4 })}
          className={active.heading({ level: 4 }) ? 'is-active' : ''}
          disabled={!commands.toggleHeading.enabled({ level: 4 })}
        >
          H4
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 5 })}
          className={active.heading({ level: 5 }) ? 'is-active' : ''}
          disabled={!commands.toggleHeading.enabled({ level: 5 })}
        >
          H5
        </button>
        <button
          onClick={() => commands.toggleHeading({ level: 6 })}
          className={active.heading({ level: 6 }) ? 'is-active' : ''}
          disabled={!commands.toggleHeading.enabled({ level: 6 })}
        >
          H6
        </button>
        <button
          onClick={() => commands.toggleBulletList()}
          className={active.bulletList() ? 'is-active' : ''}
          disabled={!commands.toggleBulletList.enabled()}
        >
          Bullet list
        </button>
        <button
          onClick={() => commands.toggleOrderedList()}
          className={active.orderedList() ? 'is-active' : ''}
          disabled={!commands.toggleOrderedList.enabled()}
        >
          Ordered list
        </button>
        <button
          onClick={() => commands.toggleTaskList()}
          className={active.taskList() ? 'is-active' : ''}
          disabled={!commands.toggleTaskList.enabled()}
        >
          Task list
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter link URL', '');
            if (url === null) return;
            if (url === '') {
              chain.removeLink().run();
              return;
            }
            chain.updateLink({ href: url, auto: false }).run();
          }}
          className={active.link() ? 'is-active' : ''}
        >
          Link
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) {
              commands.insertImage({ src: url });
            }
          }}
        >
          Image
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter YouTube URL');
            if (url) {
              // Convert to embed URL if needed
              let embedUrl = url;
              if (url.includes('watch?v=')) {
                embedUrl = url.replace('watch?v=', 'embed/');
              } else if (url.includes('youtu.be/')) {
                const videoId = url.split('youtu.be/')[1].split('?')[0];
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
              }
              // Insert as iframe using HTML
              const iframeHtml = `<iframe src="${embedUrl}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
              chain.insertHtml(iframeHtml).run();
            }
          }}
        >
          Youtube
        </button>
        <button
          onClick={() => commands.toggleCodeBlock()}
          className={active.codeBlock() ? 'is-active' : ''}
          disabled={!commands.toggleCodeBlock.enabled()}
        >
          Code block
        </button>
        <button
          onClick={() => commands.createTable()}
          className={active.table() ? 'is-active' : ''}
          disabled={!commands.createTable.enabled()}
        >
          Table
        </button>
        <button
          onClick={() => commands.toggleBlockquote()}
          className={active.blockquote() ? 'is-active' : ''}
          disabled={!commands.toggleBlockquote.enabled()}
        >
          Blockquote
        </button>
        <button
          onClick={() => commands.insertHorizontalRule()}
          disabled={!commands.insertHorizontalRule.enabled()}
        >
          Horizontal rule
        </button>
        <button
          onClick={() => commands.insertHardBreak()}
          disabled={!commands.insertHardBreak.enabled()}
        >
          Hard break
        </button>
        <button
          onClick={() => commands.undo()}
          disabled={!commands.undo.enabled()}
        >
          Undo
        </button>
        <button
          onClick={() => commands.redo()}
          disabled={!commands.redo.enabled()}
        >
          Redo
        </button>
      </div>
    </div>
  );
}

export default function RemirrorArea({
  documentId,
  content,
  onChange,
}: {
  documentId: string;
  content: string;
  onChange: (newContent: string) => void;
}) {
  const extensions = useCallback(
    () => [
      new BoldExtension({}),
      new ItalicExtension({}),
      new UnderlineExtension({}),
      new StrikeExtension({}),
      new CodeExtension({}),
      new HeadingExtension({}),
      new BlockquoteExtension({}),
      new BulletListExtension({}),
      new OrderedListExtension({}),
      new TaskListExtension({}),
      new LinkExtension({ autoLink: true }),
      new ImageExtension({ enableResizing: true }),
      new CodeBlockExtension({}),
      new HardBreakExtension({}),
      new HorizontalRuleExtension({}),
      new HistoryExtension({}),
      new PlaceholderExtension({ placeholder: 'Type something...' }),
      new DropCursorExtension({}),
      new GapCursorExtension({}),
      new TableExtension({}),
    ],
    []
  );

  const { manager, state } = useRemirror({
    extensions,
    content,
    stringHandler: 'html',
  });

  const handleChange = useCallback(
    (html: string) => {
      onChange(html);
    },
    [onChange]
  );

  return (
    <div className="remirror-editor-wrapper" data-document-id={documentId}>
      <Remirror key={documentId} manager={manager} initialContent={state} autoRender="end">
        <MenuBar documentId={documentId} />
        <OnChangeHTML onChange={handleChange} />
      </Remirror>
    </div>
  );
}
