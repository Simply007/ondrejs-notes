import './TextArea.css'

export default function TextArea({
    documentId,
    content,
    onChange }: {
        documentId: string,
        content: string,
        onChange: (newContent: string) => void
    }) {
    return (
        <textarea
            data-document-id={documentId}
            className="textarea-editor"
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type or paste your content here!"
        />
    );
}