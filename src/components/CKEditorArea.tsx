/**
 * This configuration was generated using the CKEditor 5 Builder. You can modify it anytime using this link:
 * https://ckeditor.com/ckeditor-5/builder/?redirect=portal#installation/NodgNARATAdAbDADBSIAsIRQMwkXEARgFZCo05s5EbsAOB9QunNNAThpQgFMA7FIjDBCYIeLFhCAXUjkQxRAEMeEaUA=
 */

import { useState, useEffect, useRef, useMemo } from 'react';
import { CKEditor, useCKEditorCloud } from '@ckeditor/ckeditor5-react';

import './CKEditorArea.css';

const LICENSE_KEY = import.meta.env.VITE_CK_EDITOR_LICENSE_KEY;
if (!LICENSE_KEY) {
    alert('Missing VITE_CK_EDITOR_LICENSE_KEY key - CKEditor will not work.');
    throw new Error("Missing VITE_CK_EDITOR_LICENSE_KEY key - CKEditor will not work.");
}


/**
 * USE THIS INTEGRATION METHOD ONLY FOR DEVELOPMENT PURPOSES.
 *
 * This sample is configured to use OpenAI API for handling AI Assistant queries.
 * See: https://ckeditor.com/docs/ckeditor5/latest/features/ai-assistant/ai-assistant-integration.html
 * for a full integration and customization guide.
 */
const AI_API_KEY = import.meta.env.VITE_AI_API_KEY;
if (!AI_API_KEY) {
    alert('Missing VITE_AI_API_KEY key - AI assistant won\'t work.\n Follow README for setup instructions');
}

const CLOUD_SERVICES_TOKEN_URL = import.meta.env.VITE_CLOUD_SERVICE_TOKEN_URL;
if (!CLOUD_SERVICES_TOKEN_URL) {
    alert('Missing VITE_CLOUD_SERVICE_TOKEN_URL key - AI assistant won\'t work.\n Follow README for setup instructions');
    throw new Error('Missing VITE_CLOUD_SERVICE_TOKEN_URL key - AI assistant won\'t work.\n Follow README for setup instructions');
}
const CLOUD_SERVICES_WEBSOCKET_URL = import.meta.env.VITE_CLOUD_SERVICES_WEBSOCKET_URL;
if (!CLOUD_SERVICES_WEBSOCKET_URL) {
    alert('Missing VITE_CLOUD_SERVICE_TOKEN_URL key - AI assistant won\'t work.\n Follow README for setup instructions');
    throw new Error('Missing VITE_CLOUD_SERVICE_TOKEN_URL key - AI assistant won\'t work.\n Follow README for setup instructions');
}

export default function CKEditorArea({
    documentId,
    content,
    onChange }: {
        documentId: string,
        content: string,
        onChange: (newContent: string) => void
    }) {
    const editorPresenceRef = useRef(null);
    const editorContainerRef = useRef(null);
    const editorRef = useRef(null);
    const editorRevisionHistoryRef = useRef(null);
    const editorRevisionHistoryEditorRef = useRef(null);
    const editorRevisionHistorySidebarRef = useRef(null);
    const [isLayoutReady, setIsLayoutReady] = useState(false);
    const [hasConflict, setHasConflict] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const editorInstanceRef = useRef<any>(null);
    const collaborativeContentRef = useRef<string>('');
    const cloud = useCKEditorCloud({ version: '45.1.0', premium: true });

    useEffect(() => {
        setIsLayoutReady(true);

        return () => setIsLayoutReady(false);
    }, []);

    const { ClassicEditor, editorConfig } = useMemo(() => {
        if (cloud.status !== 'success' || !isLayoutReady) {
            return {};
        }

        const {
            ClassicEditor,
            Alignment,
            AutoImage,
            AutoLink,
            Autosave,
            BlockQuote,
            Bold,
            Bookmark,
            CloudServices,
            Code,
            CodeBlock,
            Essentials,
            FindAndReplace,
            FontBackgroundColor,
            FontColor,
            FontFamily,
            FontSize,
            GeneralHtmlSupport,
            Heading,
            Highlight,
            HorizontalLine,
            ImageBlock,
            ImageCaption,
            ImageEditing,
            ImageInline,
            ImageInsertViaUrl,
            ImageResize,
            ImageStyle,
            ImageTextAlternative,
            ImageToolbar,
            ImageUpload,
            ImageUtils,
            Indent,
            IndentBlock,
            Italic,
            Link,
            LinkImage,
            List,
            ListProperties,
            Markdown,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromMarkdownExperimental,
            PasteFromOffice,
            RemoveFormat,
            SourceEditing,
            Strikethrough,
            Style,
            Subscript,
            Superscript,
            Table,
            TableCaption,
            TableCellProperties,
            TableColumnResize,
            TableProperties,
            TableToolbar,
            TodoList,
            Underline,
        } = cloud.CKEditor;
        const {
            AIAssistant,
            ExportPdf,
            FormatPainter,
            MultiLevelList,
            OpenAITextAdapter,
            PresenceList,
            RealTimeCollaborativeEditing,
            RealTimeCollaborativeRevisionHistory,
            RevisionHistory
        } = cloud.CKEditorPremiumFeatures;
        return {
            ClassicEditor,
            editorConfig: {
                toolbar: {
                    items: [
                        'undo',
                        'redo',
                        '|',
                        'revisionHistory',
                        '|',
                        'aiCommands',
                        'aiAssistant',
                        '|',
                        'exportPdf',
                        'formatPainter',
                        'findAndReplace',
                        '|',
                        'heading',
                        'style',
                        '|',
                        'fontSize',
                        'fontFamily',
                        'fontColor',
                        'fontBackgroundColor',
                        '|',
                        'bold',
                        'italic',
                        'underline',
                        'strikethrough',
                        'subscript',
                        'superscript',
                        'code',
                        '|',
                        'horizontalLine',
                        'link',
                        'insertTable',
                        'codeBlock',
                        'insertImageViaUrl',
                        'mediaEmbed',
                        '-',
                        'highlight',
                        'blockQuote',
                        '|',
                        'alignment',
                        '|',
                        'bulletedList',
                        'numberedList',
                        'multiLevelList',
                        'todoList',
                        'outdent',
                        'indent'
                    ],
                    shouldNotGroupWhenFull: true
                },
                plugins: [
                    // Premium features
                    AIAssistant,
                    ExportPdf,
                    FormatPainter,
                    MultiLevelList,
                    OpenAITextAdapter,
                    PresenceList,
                    RealTimeCollaborativeEditing,
                    RealTimeCollaborativeRevisionHistory,
                    RevisionHistory,
                    // Core features
                    Alignment,
                    AutoImage,
                    AutoLink,
                    Autosave,
                    BlockQuote,
                    Bold,
                    Bookmark,
                    CloudServices,
                    Code,
                    CodeBlock,
                    Essentials,
                    FindAndReplace,
                    FontBackgroundColor,
                    FontColor,
                    FontFamily,
                    FontSize,
                    GeneralHtmlSupport,
                    Heading,
                    Highlight,
                    HorizontalLine,
                    ImageBlock,
                    ImageCaption,
                    ImageEditing,
                    ImageInline,
                    ImageInsertViaUrl,
                    ImageResize,
                    ImageStyle,
                    ImageTextAlternative,
                    ImageToolbar,
                    ImageUpload,
                    ImageUtils,
                    Indent,
                    IndentBlock,
                    Italic,
                    Link,
                    LinkImage,
                    List,
                    ListProperties,
                    ...(import.meta.env.VITE_CKEDITOR_USE_MARKDOWN === 'true'
                        ? [Markdown]
                        : []),
                    MediaEmbed,
                    Mention,
                    Paragraph,
                    PasteFromMarkdownExperimental,
                    PasteFromOffice,
                    RemoveFormat,
                    Strikethrough,
                    Style,
                    SourceEditing,
                    Subscript,
                    Superscript,
                    Table,
                    TableCaption,
                    TableCellProperties,
                    TableColumnResize,
                    TableProperties,
                    TableToolbar,
                    TodoList,
                    Underline
                ],
                ai: {
                    openAI: {
                        requestHeaders: {
                            Authorization: 'Bearer ' + AI_API_KEY
                        }
                    }
                },
                cloudServices: {
                    tokenUrl: CLOUD_SERVICES_TOKEN_URL,
                    webSocketUrl: CLOUD_SERVICES_WEBSOCKET_URL
                },
                collaboration: {
                    channelId: documentId
                },
                exportPdf: {
                    stylesheets: [
                        /* This path should point to the content stylesheets on your assets server. */
                        /* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
                        './export-style.css',
                        /* Export PDF needs access to stylesheets that style the content. */
                        'https://cdn.ckeditor.com/ckeditor5/45.1.0/ckeditor5.css',
                        'https://cdn.ckeditor.com/ckeditor5-premium-features/45.1.0/ckeditor5-premium-features.css'
                    ],
                    fileName: 'export-pdf-demo.pdf',
                    converterOptions: {
                        format: 'Tabloid',
                        margin_top: '20mm',
                        margin_bottom: '20mm',
                        margin_right: '24mm',
                        margin_left: '24mm',
                        page_orientation: 'portrait'
                    }
                },
                heading: {
                    options: [
                        {
                            model: 'paragraph',
                            title: 'Paragraph',
                            class: 'ck-heading_paragraph'
                        },
                        {
                            model: 'heading1',
                            view: 'h1',
                            title: 'Heading 1',
                            class: 'ck-heading_heading1'
                        },
                        {
                            model: 'heading2',
                            view: 'h2',
                            title: 'Heading 2',
                            class: 'ck-heading_heading2'
                        },
                        {
                            model: 'heading3',
                            view: 'h3',
                            title: 'Heading 3',
                            class: 'ck-heading_heading3'
                        },
                        {
                            model: 'heading4',
                            view: 'h4',
                            title: 'Heading 4',
                            class: 'ck-heading_heading4'
                        },
                        {
                            model: 'heading5',
                            view: 'h5',
                            title: 'Heading 5',
                            class: 'ck-heading_heading5'
                        },
                        {
                            model: 'heading6',
                            view: 'h6',
                            title: 'Heading 6',
                            class: 'ck-heading_heading6'
                        }
                    ]
                },
                htmlSupport: {
                    allow: [
                        // Handle Tiptap YouTube videos. You can add additional attributes if you use non-default extension configuration.
                        { name: 'div', attributes: 'data-youtube-video' },
                        { name: 'iframe', attributes: { src: true, width: true, height: true, allowfullscreen: true, frameborder: true } },
                        // Handle Tiptap code blocks
                        { name: 'pre' },
                        { name: 'code', classes: true },
                        // Handle Tiptap highlight
                        { name: 'mark', styles: 'background-color', attributes: 'data-color' },
                        // Handle Tiptap text style
                        { name: 'span', styles: true },
                        // Handle classes on elements
                        { name: /.*/, classes: true },
                        // Handle Tiptap details extension
                        { name: 'details', classes: true },
                        { name: 'summary', classes: true }
                    ]
                },
                fontFamily: {
                    supportAllValues: true
                },
                initialData: content,
                licenseKey: LICENSE_KEY,
                link: {
                    addTargetToExternalLinks: true,
                    defaultProtocol: 'https://',
                    decorators: {
                        toggleDownloadable: {
                            mode: 'manual',
                            label: 'Downloadable',
                            attributes: {
                                download: 'file'
                            }
                        }
                    }
                },
                list: {
                    properties: {
                        styles: true,
                        startIndex: true,
                        reversed: true
                    }
                },
                placeholder: 'Type or paste your content here!',
                presenceList: {
                    container: editorPresenceRef.current
                },
                revisionHistory: {
                    editorContainer: editorContainerRef.current,
                    viewerContainer: editorRevisionHistoryRef.current,
                    viewerEditorElement: editorRevisionHistoryEditorRef.current,
                    viewerSidebarContainer: editorRevisionHistorySidebarRef.current,
                    resumeUnsavedRevision: true
                },
                sourceEditing: {
                    allowCollaborationFeatures: true
                },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any
        };
    }, [cloud, isLayoutReady, content, documentId]);

    const handleConflictResolution = (useCollaborative: boolean) => {
        if (editorInstanceRef.current) {
            if (useCollaborative) {
                // Use collaborative version - update parent with collaborative content
                onChange(collaborativeContentRef.current);
            } else {
                // Update collaborative version with local content
                // editorInstanceRef.current.setData(content, { suppressErrorInCollaboration: true });
                // https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-realtimecollaborationclient-editor-setdata-and-editor-data-set-are-forbidden-in-real-time-collaboration
                editorInstanceRef.current.data.set(content, { suppressErrorInCollaboration: true });
            }
        }
        setHasConflict(false);
    };

    return (
        <>
            {hasConflict && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        maxWidth: '500px',
                        textAlign: 'center'
                    }}>
                        <h3>Content Conflict Detected</h3>
                        <p>There are differences between your local changes and the collaborative version.</p>
                        <p>What would you like to do?</p>
                        <div style={{ marginTop: '20px' }}>
                            <button
                                onClick={() => handleConflictResolution(true)}
                                style={{
                                    margin: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#007cba',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Load Last Collaborative Version
                            </button>
                            <button
                                onClick={() => handleConflictResolution(false)}
                                style={{
                                    margin: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#dc3545',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Replace Collaborative Version with Local Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="presence" ref={editorPresenceRef}></div>
            <div className="editor-container editor-container_classic-editor" ref={editorContainerRef}>
                <div className="editor-container__editor">
                    <div ref={editorRef}>{ClassicEditor && editorConfig && <CKEditor
                        editor={ClassicEditor}
                        config={editorConfig}
                        onReady={(editor) => {
                            editorInstanceRef.current = editor;
                            const collaborativeContent = editor.getData();
                            collaborativeContentRef.current = collaborativeContent;

                            // Check if there's a conflict between local content and collaborative content
                            if (content && collaborativeContent && content !== collaborativeContent && content.trim() !== '' && collaborativeContent.trim() !== '') {
                                setHasConflict(true);
                            }
                        }}
                        onChange={(_event, editor) => {
                            const data = editor.getData();
                            onChange(data);
                        }}
                    />}
                    </div>
                </div>
            </div>
            <div className="revision-history" ref={editorRevisionHistoryRef}>
                <div className="revision-history__wrapper">
                    <div className="revision-history__editor" ref={editorRevisionHistoryEditorRef}></div>
                    <div className="revision-history__sidebar" ref={editorRevisionHistorySidebarRef}></div>
                </div>
            </div>
        </>
    );
}