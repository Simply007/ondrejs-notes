import {
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
    // TODO: Custom/extra
    Plugin
} from "ckeditor5";

import {
    AIAssistant,
    ExportPdf,
    FormatPainter,
    MultiLevelList,
    OpenAITextAdapter,
    PresenceList,
    RealTimeCollaborativeEditing,
    RealTimeCollaborativeRevisionHistory,
    RevisionHistory
} from "ckeditor5-premium-features";

class CKEditorCS extends ClassicEditor { }

class SupportTiptapMention extends Plugin {
    init() {
        const editor = this.editor;

        editor.conversion.for('upcast').elementToAttribute({
            view: {
                name: 'span',
                key: 'data-type',
                value: 'mention',
                attributes: {
                    'data-id': true
                }
            },
            model: {
                key: 'mention',
                value: (viewItem) => {
                    // The mention feature expects that the mention attribute value
                    // in the model is a plain object with a set of additional attributes.
                    // In order to create a proper object use the toMentionAttribute() helper method:
                    const mentionAttribute = editor.plugins.get('Mention').toMentionAttribute(viewItem, {
                        // Add any other properties that you need.
                        id: viewItem.getAttribute('data-id')
                    });

                    return mentionAttribute;
                }
            },
            converterPriority: 'high'
        });
    }
}

CKEditorCS.builtinPlugins = [
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
    Underline,
    SupportTiptapMention
];

export default CKEditorCS;