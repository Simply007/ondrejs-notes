import { useRef } from 'react';
import ReactQuill from 'react-quill';

// Import Quill CSS
import 'quill/dist/quill.snow.css';

import './QuillArea.css';

/**
 * IMPORTANT NOTE - Quill React Wrapper Status (Checkpoint Documentation)
 *
 * Quill Editor Background:
 * - Quill (https://quilljs.com/) is maintained by Slab (now part of Notion)
 * - Quill core library does NOT have an official React wrapper
 * - All React wrappers are community-maintained, not by the Quill/Slab team
 *
 * React Wrapper Options & Issues:
 *
 * 1. react-quill (original community wrapper):
 *    - Author: zenoamaro
 *    - Most popular historically (~1M weekly downloads)
 *    - Latest version: 2.0.0
 *    - ISSUE: Does NOT support React 19
 *    - Reason: Uses deprecated ReactDOM.findDOMNode (removed in React 19)
 *    - Error: "TypeError: react_dom_1.default.findDOMNode is not a function"
 *    - Status: Appears unmaintained (multiple unresolved React 19 issues since 2024)
 *    - GitHub Issues: #972, #981, #989, #1037
 *
 * 2. react-quill-new (maintained fork):
 *    - Maintained community fork of react-quill
 *    - Latest version: 3.6.0
 *    - Supports React 16, 17, 18, AND 19
 *    - API-compatible with react-quill (drop-in replacement)
 *    - Requires peer dependency: quill-delta ^5.1.0
 *    - This is the RECOMMENDED package for React 19 projects
 *
 * Current Implementation:
 * - Currently using: react-quill v2.0.0
 * - Status: WILL NOT WORK with React 19 (crashes on mount)
 * - Required Action: Switch to react-quill-new v3.6.0
 *   - npm uninstall react-quill
 *   - npm install react-quill-new quill-delta
 *   - Change import: import ReactQuill from 'react-quill-new';
 *   - No other code changes needed (API compatible)
 *
 * Alternative Approach:
 * - Can use Quill directly (vanilla JS) with React useEffect
 * - More control but requires manual React integration
 * - See implementation example in this file's git history
 *
 * Future Considerations:
 * - Monitor if Quill team releases official React wrapper
 * - Watch react-quill-new for maintenance status
 * - Consider switching to other editors if wrapper becomes unmaintained
 * - Other open-source alternatives: Lexical (Meta), TipTap (ProseMirror-based)
 */

export default function QuillArea({
    documentId,
    content,
    onChange
}: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void
}) {
    const quillRef = useRef<ReactQuill>(null);

    // Toolbar configuration matching features from other editors
    const modules = {
        toolbar: [
            // Text formatting
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'script': 'sub' }, { 'script': 'super' }],

            // Colors
            [{ 'color': [] }, { 'background': [] }],

            // Font and size
            [{ 'font': [] }],
            [{ 'size': ['small', false, 'large', 'huge'] }],

            // Lists and alignment
            [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'align': [] }],

            // Rich content
            ['blockquote', 'code-block'],
            ['link', 'image', 'video'],

            // Misc
            ['clean']
        ],
        clipboard: {
            matchVisual: false
        }
    };

    // Formats that Quill supports
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike',
        'script',
        'color', 'background',
        'font', 'size',
        'list', 'bullet', 'indent', 'align',
        'blockquote', 'code-block',
        'link', 'image', 'video'
    ];

    const handleChange = (value: string) => {
        onChange(value);
    };

    return (
        <div className="quill-container" data-document-id={documentId}>
            <ReactQuill
                ref={quillRef}
                theme="snow"
                value={content}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder="Type something..."
            />
        </div>
    );
}
