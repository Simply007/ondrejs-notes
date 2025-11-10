import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './QuillArea.css';

const QuillEditor = forwardRef<Quill | null, {
    defaultValue?: string;
    onTextChange?: (html: string) => void;
}>(({ defaultValue, onTextChange }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onTextChangeRef = useRef(onTextChange);

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
    });

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const editorContainer = container.appendChild(
            container.ownerDocument.createElement('div'),
        );

        const quill = new Quill(editorContainer, {
            theme: 'snow',
            placeholder: 'Type something...',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'font': [] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['blockquote', 'code-block'],
                    ['link', 'image', 'video'],
                    ['clean']
                ],
                clipboard: {
                    matchVisual: false
                }
            }
        });

        if (typeof ref === 'function') {
            ref(quill);
        } else if (ref) {
            ref.current = quill;
        }

        if (defaultValue) {
            quill.clipboard.dangerouslyPasteHTML(defaultValue);
        }

        quill.on(Quill.events.TEXT_CHANGE, () => {
            const html = quill.root.innerHTML;
            onTextChangeRef.current?.(html);
        });

        return () => {
            if (typeof ref === 'function') {
                ref(null);
            } else if (ref) {
                ref.current = null;
            }
            container.innerHTML = '';
        };
    }, [ref]);

    return <div ref={containerRef}></div>;
});

QuillEditor.displayName = 'QuillEditor';

export default function QuillArea({
    documentId,
    content,
    onChange
}: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void
}) {
    const quillRef = useRef<Quill | null>(null);

    return (
        <div className="quill-container" data-document-id={documentId}>
            <QuillEditor
                ref={quillRef}
                defaultValue={content}
                onTextChange={onChange}
            />
        </div>
    );
}
