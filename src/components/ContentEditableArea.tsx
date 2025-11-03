import { useRef, useEffect, useState } from 'react';
import './ContentEditableArea.css';

// Helper function to insert HTML at current cursor position
function insertHTMLAtCursor(html: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const template = document.createElement('template');
    template.innerHTML = html.trim();
    const fragment = template.content;

    range.insertNode(fragment);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
}

// Helper function to check if current selection has a specific parent tag
function hasParentTag(tagName: string): boolean {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    let node: Node | null = selection.anchorNode;
    while (node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === tagName.toUpperCase()) {
                return true;
            }
        }
        node = node.parentNode;
    }
    return false;
}

// Helper function to wrap selection in a tag
function wrapSelection(tagName: string) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();

    if (selectedText) {
        const wrapper = document.createElement(tagName);
        wrapper.textContent = selectedText;
        range.deleteContents();
        range.insertNode(wrapper);

        // Move cursor after the inserted element
        range.setStartAfter(wrapper);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

export default function ContentEditableArea({ documentId, content, onChange }: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void
}) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isUserTyping = useRef(false);

    // State for tracking active formatting
    const [editorState, setEditorState] = useState({
        isBold: false,
        isItalic: false,
        isStrike: false,
        isCode: false,
        isParagraph: false,
        isH1: false,
        isH2: false,
        isH3: false,
        isH4: false,
        isH5: false,
        isH6: false,
        isBulletList: false,
        isOrderedList: false,
        isBlockquote: false,
        isCodeBlock: false,
        canUndo: false,
        canRedo: false,
    });

    // Update content when prop changes (e.g., switching notes)
    useEffect(() => {
        if (editorRef.current && !isUserTyping.current) {
            if (editorRef.current.innerHTML !== content) {
                editorRef.current.innerHTML = content || '';
            }
        }
        isUserTyping.current = false;
    }, [content]);

    // Update editor state on selection change
    useEffect(() => {
        const updateEditorState = () => {
            if (!editorRef.current?.contains(document.activeElement)) return;

            setEditorState({
                // DEPRECATED: document.queryCommandState is deprecated but still widely supported
                isBold: document.queryCommandState('bold'),
                isItalic: document.queryCommandState('italic'),
                isStrike: document.queryCommandState('strikeThrough'),
                isCode: hasParentTag('CODE'),
                isParagraph: hasParentTag('P'),
                isH1: hasParentTag('H1'),
                isH2: hasParentTag('H2'),
                isH3: hasParentTag('H3'),
                isH4: hasParentTag('H4'),
                isH5: hasParentTag('H5'),
                isH6: hasParentTag('H6'),
                isBulletList: document.queryCommandState('insertUnorderedList'),
                isOrderedList: document.queryCommandState('insertOrderedList'),
                isBlockquote: hasParentTag('BLOCKQUOTE'),
                isCodeBlock: hasParentTag('PRE'),
                // DEPRECATED: document.queryCommandEnabled is deprecated but still widely supported
                canUndo: document.queryCommandEnabled('undo'),
                canRedo: document.queryCommandEnabled('redo'),
            });
        };

        document.addEventListener('selectionchange', updateEditorState);
        return () => document.removeEventListener('selectionchange', updateEditorState);
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            isUserTyping.current = true;
            onChange(editorRef.current.innerHTML);
        }
    };

    // Command handlers
    const execCommand = (command: string, value?: string) => {
        // DEPRECATED: document.execCommand is deprecated but still widely supported
        // It remains the primary way to execute formatting commands in contentEditable
        document.execCommand(command, false, value);
        editorRef.current?.focus();
        handleInput();
    };

    const handleBold = () => execCommand('bold');
    const handleItalic = () => execCommand('italic');
    const handleStrike = () => execCommand('strikeThrough');

    const handleCode = () => {
        if (editorState.isCode) {
            // Unwrap code tag - use execCommand with a workaround
            execCommand('removeFormat');
        } else {
            wrapSelection('code');
            editorRef.current?.focus();
            handleInput();
        }
    };

    const handleClearMarks = () => {
        execCommand('removeFormat');
    };

    const handleClearNodes = () => {
        execCommand('formatBlock', '<p>');
    };

    const handleParagraph = () => execCommand('formatBlock', '<p>');
    const handleH1 = () => execCommand('formatBlock', '<h1>');
    const handleH2 = () => execCommand('formatBlock', '<h2>');
    const handleH3 = () => execCommand('formatBlock', '<h3>');
    const handleH4 = () => execCommand('formatBlock', '<h4>');
    const handleH5 = () => execCommand('formatBlock', '<h5>');
    const handleH6 = () => execCommand('formatBlock', '<h6>');

    const handleBulletList = () => execCommand('insertUnorderedList');
    const handleOrderedList = () => execCommand('insertOrderedList');

    const handleTaskList = () => {
        const html = `
<ul>
  <li><input type="checkbox" /> Task 1</li>
  <li><input type="checkbox" /> Task 2</li>
  <li><input type="checkbox" /> Task 3</li>
</ul>`;
        insertHTMLAtCursor(html);
        editorRef.current?.focus();
        handleInput();
    };

    const handleLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            execCommand('createLink', url);
        }
    };

    const handleImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
            execCommand('insertImage', url);
        }
    };

    const handleYoutube = () => {
        const url = window.prompt('Enter YouTube URL:');
        if (url) {
            // Extract video ID from various YouTube URL formats
            let videoId = '';
            const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([^&?\/]+)/);
            if (match && match[1]) {
                videoId = match[1];
            }

            if (videoId) {
                const embedHtml = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                insertHTMLAtCursor(embedHtml);
                editorRef.current?.focus();
                handleInput();
            } else {
                alert('Invalid YouTube URL');
            }
        }
    };

    const handleCodeBlock = () => {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString() || 'Code here';

        const codeBlock = document.createElement('pre');
        const code = document.createElement('code');
        code.textContent = selectedText;
        codeBlock.appendChild(code);

        range.deleteContents();
        range.insertNode(codeBlock);

        // Move cursor after the code block
        range.setStartAfter(codeBlock);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        editorRef.current?.focus();
        handleInput();
    };

    const handleTable = () => {
        const tableHtml = `
<table>
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
      <th>Header 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Cell 1</td>
      <td>Cell 2</td>
      <td>Cell 3</td>
    </tr>
    <tr>
      <td>Cell 4</td>
      <td>Cell 5</td>
      <td>Cell 6</td>
    </tr>
  </tbody>
</table>`;
        insertHTMLAtCursor(tableHtml);
        editorRef.current?.focus();
        handleInput();
    };

    const handleBlockquote = () => execCommand('formatBlock', '<blockquote>');
    const handleHorizontalRule = () => execCommand('insertHorizontalRule');
    const handleHardBreak = () => execCommand('insertLineBreak');
    const handleUndo = () => execCommand('undo');
    const handleRedo = () => execCommand('redo');

    // MenuBar inline component
    const MenuBar = () => (
        <div className="control-group">
            <div className="button-group">
                {/* Text Formatting */}
                <button
                    onClick={handleBold}
                    className={editorState.isBold ? 'is-active' : ''}
                    title="Bold"
                >
                    Bold
                </button>
                <button
                    onClick={handleItalic}
                    className={editorState.isItalic ? 'is-active' : ''}
                    title="Italic"
                >
                    Italic
                </button>
                <button
                    onClick={handleStrike}
                    className={editorState.isStrike ? 'is-active' : ''}
                    title="Strikethrough"
                >
                    Strike
                </button>
                <button
                    onClick={handleCode}
                    className={editorState.isCode ? 'is-active' : ''}
                    title="Code"
                >
                    Code
                </button>
                <button onClick={handleClearMarks} title="Clear marks">
                    Clear marks
                </button>
                <button onClick={handleClearNodes} title="Clear nodes">
                    Clear nodes
                </button>

                {/* Block Formatting */}
                <button
                    onClick={handleParagraph}
                    className={editorState.isParagraph ? 'is-active' : ''}
                    title="Paragraph"
                >
                    Paragraph
                </button>
                <button
                    onClick={handleH1}
                    className={editorState.isH1 ? 'is-active' : ''}
                    title="Heading 1"
                >
                    H1
                </button>
                <button
                    onClick={handleH2}
                    className={editorState.isH2 ? 'is-active' : ''}
                    title="Heading 2"
                >
                    H2
                </button>
                <button
                    onClick={handleH3}
                    className={editorState.isH3 ? 'is-active' : ''}
                    title="Heading 3"
                >
                    H3
                </button>
                <button
                    onClick={handleH4}
                    className={editorState.isH4 ? 'is-active' : ''}
                    title="Heading 4"
                >
                    H4
                </button>
                <button
                    onClick={handleH5}
                    className={editorState.isH5 ? 'is-active' : ''}
                    title="Heading 5"
                >
                    H5
                </button>
                <button
                    onClick={handleH6}
                    className={editorState.isH6 ? 'is-active' : ''}
                    title="Heading 6"
                >
                    H6
                </button>

                {/* Lists */}
                <button
                    onClick={handleBulletList}
                    className={editorState.isBulletList ? 'is-active' : ''}
                    title="Bullet list"
                >
                    Bullet list
                </button>
                <button
                    onClick={handleOrderedList}
                    className={editorState.isOrderedList ? 'is-active' : ''}
                    title="Ordered list"
                >
                    Ordered list
                </button>
                <button onClick={handleTaskList} title="Task list">
                    Task list
                </button>

                {/* Links and Media */}
                <button onClick={handleLink} title="Link">
                    Link
                </button>
                <button onClick={handleImage} title="Image">
                    Image
                </button>
                <button onClick={handleYoutube} title="YouTube">
                    Youtube
                </button>

                {/* Advanced Blocks */}
                <button
                    onClick={handleCodeBlock}
                    className={editorState.isCodeBlock ? 'is-active' : ''}
                    title="Code block"
                >
                    Code block
                </button>
                <button onClick={handleTable} title="Table">
                    Table
                </button>
                <button
                    onClick={handleBlockquote}
                    className={editorState.isBlockquote ? 'is-active' : ''}
                    title="Blockquote"
                >
                    Blockquote
                </button>

                {/* Miscellaneous */}
                <button onClick={handleHorizontalRule} title="Horizontal rule">
                    Horizontal rule
                </button>
                <button onClick={handleHardBreak} title="Hard break">
                    Hard break
                </button>
                <button
                    onClick={handleUndo}
                    disabled={!editorState.canUndo}
                    title="Undo"
                >
                    Undo
                </button>
                <button
                    onClick={handleRedo}
                    disabled={!editorState.canRedo}
                    title="Redo"
                >
                    Redo
                </button>
            </div>
        </div>
    );

    return (
        <div>
            <MenuBar />
            <div
                ref={editorRef}
                className="contenteditable-editor"
                contentEditable="true"
                onInput={handleInput}
                data-document-id={documentId}
                suppressContentEditableWarning={true}
            />
        </div>
    );
}
