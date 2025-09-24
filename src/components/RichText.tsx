import { useState } from 'react';
import CKEditorArea from './CKEditorArea';
import TextArea from './TextArea';

import './RichText.css';
import TipTapArea from './TipTapArea';

type EditorType = 'CKEditor' | 'TipTap' | 'TextArea';

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
                    <option value="TextArea">TextArea</option>
                </select>
            </div>

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
            ) : (
                <TextArea
                    documentId={documentId}
                    content={content}
                    onChange={onChange}
                />
            )}
        </div>
    );
}