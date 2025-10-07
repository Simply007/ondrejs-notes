import CKEditorArea from './CKEditorArea';
import TiptapArea from './xTiptapArea';
import './RichText.css';

type EditorType = 'Tiptap' | 'CKEditor';

export default function RichText({
    documentId,
    content,
    ckEditorContent,
    isMigrated,
    selectedEditor,
    onEditorChange,
    onChange
}: {
    documentId: string,
    content: string | null,
    ckEditorContent?: string,
    isMigrated: boolean,
    selectedEditor: EditorType,
    onEditorChange: (editor: EditorType) => void,
    onChange: (newContent: string) => void
}) {
    // CKEditor-only notes (content === null): Show only CKEditor
    const isCKEditorOnly = content === null && ckEditorContent !== undefined;
    if (isCKEditorOnly) {
        return (
            <div className="main-container">
                <div className="editor-container">
                    <CKEditorArea
                        documentId={documentId}
                        content={ckEditorContent || ''}
                        onChange={onChange}
                    />
                </div>
            </div>
        );
    }

    // Non-migrated Tiptap notes: Tiptap only
    if (!isMigrated) {
        return (
            <div className="main-container">
                <div className="editor-container">
                    <TiptapArea
                        documentId={documentId}
                        content={content || ''}
                        onChange={onChange}
                    />
                </div>
            </div>
        );
    }

    // Migrated notes: Show dropdown and appropriate editor
    return (
        <div className="main-container">
            <div className="editor-selector">
                <label htmlFor="editor-type">Editor Type:</label>
                <select
                    id="editor-type"
                    value={selectedEditor}
                    onChange={(e) => onEditorChange(e.target.value as EditorType)}
                >
                    <option value="Tiptap">Tiptap (Original - Read Only)</option>
                    <option value="CKEditor">CKEditor</option>
                </select>
            </div>

            {selectedEditor === 'Tiptap' && (
                <div className="migration-warning">
                    ⚠️ This content has been migrated to CKEditor.
                    The Tiptap version is read-only.
                    Switch to CKEditor to edit the current version.
                </div>
            )}

            <div className="editor-container">
                {selectedEditor === 'Tiptap' ? (
                    <TiptapArea
                        documentId={documentId}
                        content={content || ''}
                        onChange={() => {}} // Read-only
                        readOnly={true}
                    />
                ) : (
                    <CKEditorArea
                        documentId={documentId}
                        content={ckEditorContent || content || ''}
                        onChange={onChange}
                    />
                )}
            </div>
        </div>
    );
}