import { useState } from 'react';
import CKEditorArea from './CKEditorArea';
import TextArea from './TextArea';
import TipTapArea from './TipTapArea';
import TinyMCEArea from './TinyMCEArea';
import LexicalArea from './LexicalArea';
import FroalaArea from './FroalaArea';
import QuillArea from './QuillArea';
import SlateArea from './SlateArea';

import './RichText.css';

type EditorType = 'CKEditor' | 'TipTap' | 'Lexical' | 'TinyMCE' | 'Froala' | 'Quill' | 'Slate' | 'TextArea';

export default function RichText({
    documentId,
    content,
    onChange }: {
        documentId: string,
        content: string,
        onChange: (newContent: string) => void
    }) {
    const [editorType, setEditorType] = useState<EditorType>('CKEditor');

    const handleEditorTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setEditorType(event.target.value as EditorType);
    };

    return (
        <div className="main-container">
            <div className="editor-selector">
                <label htmlFor="editor-type">Editor Type:</label>
                <select id="editor-type" value={editorType} onChange={handleEditorTypeChange}>
                    <option value="CKEditor">CKEditor</option>
                    <option value="TipTap">TipTap</option>
                    <option value="TinyMCE">TinyMCE</option>
                    <option value="Lexical">Lexical</option>
                    <option value="Froala">Froala</option>
                    <option value="Quill">Quill</option>
                    <option value="Slate">Slate</option>
                    <option value="TextArea">TextArea</option>
                </select>
            </div>

            <div className="editor-container">
                {editorType === 'CKEditor' ? (
                    <CKEditorArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : editorType === 'TipTap' ? (
                    <TipTapArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : editorType === 'TinyMCE' ? (
                    <TinyMCEArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : editorType === 'Lexical' ? (
                    <LexicalArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : editorType === 'Froala' ? (
                    <FroalaArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : editorType === 'Quill' ? (
                    <QuillArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : editorType === 'Slate' ? (
                    <SlateArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                ) : (
                    <TextArea
                        documentId={documentId}
                        content={content}
                        onChange={onChange}
                    />
                )}
            </div>
        </div>
    );
}