import { useRef, useEffect } from 'react';
import './ContentEditableArea.css';

export default function ContentEditableArea({ documentId, content, onChange }: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void
}) {
    const editorRef = useRef<HTMLDivElement>(null);
    const isUserTyping = useRef(false);

    // Update content when prop changes (e.g., switching notes)
    // But don't update while user is actively typing to avoid cursor jumps
    useEffect(() => {
        if (editorRef.current && !isUserTyping.current) {
            if (editorRef.current.innerHTML !== content) {
                editorRef.current.innerHTML = content || '';
            }
        }
        isUserTyping.current = false;
    }, [content]);

    const handleInput = () => {
        if (editorRef.current) {
            isUserTyping.current = true;
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div
            ref={editorRef}
            className="contenteditable-editor"
            contentEditable="true"
            onInput={handleInput}
            data-document-id={documentId}
            suppressContentEditableWarning={true}
        />
    );
}
