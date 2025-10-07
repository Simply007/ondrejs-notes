import { useEditor, EditorContent, Editor, useEditorState } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import History from '@tiptap/extension-history'
import Typography from '@tiptap/extension-typography'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import Youtube from '@tiptap/extension-youtube'
import CodeBlock from '@tiptap/extension-code-block'
import Mention from '@tiptap/extension-mention'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'


import './TipTapArea.css';


function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ctx => {
      return {
        isBold: ctx.editor.isActive('bold') ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive('italic') ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive('strike') ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive('code') ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isParagraph: ctx.editor.isActive('paragraph') ?? false,
        isHeading1: ctx.editor.isActive('heading', { level: 1 }) ?? false,
        isHeading2: ctx.editor.isActive('heading', { level: 2 }) ?? false,
        isHeading3: ctx.editor.isActive('heading', { level: 3 }) ?? false,
        isHeading4: ctx.editor.isActive('heading', { level: 4 }) ?? false,
        isHeading5: ctx.editor.isActive('heading', { level: 5 }) ?? false,
        isHeading6: ctx.editor.isActive('heading', { level: 6 }) ?? false,
        isBulletList: ctx.editor.isActive('bulletList') ?? false,
        isOrderedList: ctx.editor.isActive('orderedList') ?? false,
        isCodeBlock: ctx.editor.isActive('codeBlock') ?? false,
        isBlockquote: ctx.editor.isActive('blockquote') ?? false,
        canUndo: ctx.editor.can().chain().undo().run() ?? false,
        canRedo: ctx.editor.can().chain().redo().run() ?? false,
        isTable: ctx.editor.isActive('table') ?? false,
        canTable: ctx.editor.can().chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() ?? false,
        isTaskList: ctx.editor.isActive('taskList') ?? false,
        canTaskList: ctx.editor.can().chain().toggleTaskList().run() ?? false,
        isImage: ctx.editor.isActive('image') ?? false,
        canImage: ctx.editor.can().chain().setImage({ src: 'https://example.com/image.jpg' }).run() ?? false,
        isLink: ctx.editor.isActive('link') ?? false,
        canLink: ctx.editor.can().chain().toggleLink({ href: 'https://example.com' }).run() ?? false,
        isYoutube: ctx.editor.isActive('youtube') ?? false,
        canYoutube: ctx.editor.can().chain().focus().setYoutubeVideo({ src: 'https://youtu.be/3lTUAWOgoHs' }).run() ?? false,
      }
    },
  })

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? 'is-active' : ''}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editorState.isParagraph ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editorState.isHeading1 ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editorState.isHeading2 ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editorState.isHeading3 ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editorState.isHeading4 ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editorState.isHeading5 ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editorState.isHeading6 ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          disabled={!editorState.canTaskList}
          className={editorState.isTaskList ? 'is-active' : ''}
        >
          Task list
        </button>
        <button
          onClick={() => {
            const previousUrl = editor.getAttributes('link').href || '';
            const url = window.prompt('Enter link URL', previousUrl);
            if (url === null) return;
            if (url === '') {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().setLink({ href: url }).run();
          }}
          disabled={!editorState.canLink}
          className={editorState.isLink ? 'is-active' : ''}
        >
          Link
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter image URL');
            if (url) {
              editor.chain().focus().setImage({ src: url }).run();
            }
          }}
          disabled={!editorState.canImage}
          className={editorState.isImage ? 'is-active' : ''}
        >
          Image
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter YouTube URL');
            if (url) {
              editor.chain().focus().setYoutubeVideo({ src: url }).run();
            }
          }}
          disabled={!editorState.canYoutube}
          className={editorState.isYoutube ? 'is-active' : ''}
        >
          Youtube
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
          disabled={!editorState.canTable}
          className={editorState.isTable ? 'is-active' : ''}
        >
          Table
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>Horizontal rule</button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editorState.canUndo}>
          Undo
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editorState.canRedo}>
          Redo
        </button>
      </div>
    </div>
  )
}

export default function Tiptap({
  documentId,
  content,
  onChange,
  readOnly = false
}: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void,
    readOnly?: boolean
  }) {

  const editor = useEditor({
    extensions: [
      Document, Paragraph, Text, HardBreak, HorizontalRule,
      Bold, Italic, Strike, Code, Blockquote,
      BulletList, OrderedList, ListItem,
      Heading.configure({ levels: [1, 2, 3] }),
      Link, Image,
      TaskList, TaskItem,
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
      Placeholder.configure({ placeholder: 'Type something...' }),
      CharacterCount.configure({ limit: 2000 }),
      History, Typography,
      TextStyle, Highlight.configure({ multicolor: true }), Underline, Subscript, Superscript,
      Dropcursor, Gapcursor, Youtube, CodeBlock,
      Mention.configure(
        {
          HTMLAttributes: { class: 'mention' },
          suggestion: {
            items: () => [],
            render: () => ({
              onStart: () => { },
              onUpdate: () => { },
              onKeyDown: () => false,
              onExit: () => { },
            }),
          },
          renderText: ({ node }) => `@${node.attrs.label || node.attrs.id}`
        }
      ),
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] })
    ], // define your extension array
    content: content, // initial content
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (!readOnly) {
        const newContent = editor.getHTML();
        onChange(newContent);
      }
    },

  })

  return (
    <div data-document-id={documentId} className='editor-wrapper'>
      {!readOnly && <MenuBar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}