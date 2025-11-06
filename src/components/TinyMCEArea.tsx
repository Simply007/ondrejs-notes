import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { Editor as TinyMCEEditor } from 'tinymce';

import './TinyMCEArea.css';

export default function TinyMCEArea({
    documentId,
    content,
    onChange
}: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void
}) {
    const editorRef = useRef<TinyMCEEditor | null>(null);

    return (
        <div className="tinymce-container" data-document-id={documentId}>
            <Editor
                apiKey={import.meta.env.VITE_TINYMCE_API_KEY || "no-api-key"}
                onInit={(_evt, editor) => editorRef.current = editor}
                value={content}
                onEditorChange={(newValue) => onChange(newValue)}
                init={{
                    height: 600,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                        'emoticons', 'codesample', 'quickbars'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic underline strikethrough forecolor backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | link image media table codesample | code help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                    branding: false,
                    promotion: false,
                }}
            />
        </div>
    );
}
