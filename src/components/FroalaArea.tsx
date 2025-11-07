import { useRef } from 'react';
import FroalaEditorComponent from 'react-froala-wysiwyg';

// Import Froala Editor CSS
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// Import Froala Editor plugins
import 'froala-editor/js/plugins/align.min.js';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/js/plugins/code_beautifier.min.js';
import 'froala-editor/js/plugins/code_view.min.js';
import 'froala-editor/js/plugins/colors.min.js';
import 'froala-editor/js/plugins/emoticons.min.js';
import 'froala-editor/js/plugins/font_family.min.js';
import 'froala-editor/js/plugins/font_size.min.js';
import 'froala-editor/js/plugins/fullscreen.min.js';
import 'froala-editor/js/plugins/image.min.js';
import 'froala-editor/js/plugins/inline_style.min.js';
import 'froala-editor/js/plugins/line_breaker.min.js';
import 'froala-editor/js/plugins/link.min.js';
import 'froala-editor/js/plugins/lists.min.js';
import 'froala-editor/js/plugins/paragraph_format.min.js';
import 'froala-editor/js/plugins/paragraph_style.min.js';
import 'froala-editor/js/plugins/quote.min.js';
import 'froala-editor/js/plugins/table.min.js';
import 'froala-editor/js/plugins/url.min.js';
import 'froala-editor/js/plugins/video.min.js';
import 'froala-editor/js/plugins/word_paste.min.js';
import 'froala-editor/js/plugins/special_characters.min.js';

import './FroalaArea.css';

export default function FroalaArea({
    documentId,
    content,
    onChange
}: {
    documentId: string,
    content: string,
    onChange: (newContent: string) => void
}) {
    const editorRef = useRef(null);

    const config = {
        key: import.meta.env.VITE_FROALA_LICENSE_KEY || 'trial-license',
        attribution: false,
        heightMin: 400,
        placeholderText: 'Type something...',
        charCounterCount: true,
        charCounterMax: 2000,

        // Toolbar configuration matching TipTap/CKEditor features
        toolbarButtons: {
            'moreText': {
                'buttons': ['bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor', 'inlineClass', 'inlineStyle', 'clearFormatting']
            },
            'moreParagraph': {
                'buttons': ['alignLeft', 'alignCenter', 'alignRight', 'alignJustify', 'formatOLSimple', 'formatOL', 'formatUL', 'paragraphFormat', 'paragraphStyle', 'lineHeight', 'outdent', 'indent', 'quote']
            },
            'moreRich': {
                'buttons': ['insertLink', 'insertImage', 'insertVideo', 'insertTable', 'emoticons', 'fontAwesome', 'specialCharacters', 'embedly', 'insertHR']
            },
            'moreMisc': {
                'buttons': ['undo', 'redo', 'fullscreen', 'print', 'getPDF', 'spellChecker', 'selectAll', 'html', 'help'],
                'align': 'right',
                'buttonsVisible': 2
            }
        },

        // Plugins to enable features matching TipTap/CKEditor
        pluginsEnabled: [
            'align', 'charCounter', 'codeBeautifier', 'codeView', 'colors',
            'emoticons', 'fontFamily', 'fontSize', 'fullscreen', 'image',
            'inlineStyle', 'lineBreaker', 'link', 'lists', 'paragraphFormat',
            'paragraphStyle', 'quote', 'table', 'url', 'video', 'wordPaste',
            'specialCharacters'
        ],

        // Paragraph formats (headings)
        paragraphFormat: {
            N: 'Normal',
            H1: 'Heading 1',
            H2: 'Heading 2',
            H3: 'Heading 3',
            H4: 'Heading 4',
            H5: 'Heading 5',
            H6: 'Heading 6'
        },

        // Font family options
        fontFamily: {
            'Arial,Helvetica,sans-serif': 'Arial',
            'Georgia,serif': 'Georgia',
            'Impact,Charcoal,sans-serif': 'Impact',
            'Tahoma,Geneva,sans-serif': 'Tahoma',
            'Times New Roman,Times,serif': 'Times New Roman',
            'Verdana,Geneva,sans-serif': 'Verdana',
            'Courier New,Courier,monospace': 'Courier New'
        },

        // Font size options
        fontSize: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '30', '36', '48', '60', '72'],

        // Image settings
        imageUpload: false,
        imageDefaultWidth: 0,
        imageResizeWithPercent: true,

        // Video settings
        videoUpload: false,
        videoDefaultWidth: 600,

        // Link settings
        linkAlwaysBlank: false,
        linkAutoPrefix: 'https://',

        // Table settings
        tableEditButtons: ['tableHeader', 'tableRemove', 'tableRows', 'tableColumns', 'tableStyle', '-', 'tableCells', 'tableCellBackground', 'tableCellVerticalAlign', 'tableCellHorizontalAlign', 'tableCellStyle'],
        tableColors: ['#61BD6D', '#1ABC9C', '#54ACD2', '#2C82C9', '#9365B8', '#475577', '#CCCCCC', '#41A85F', '#00A885', '#3D8EB9', '#2969B0', '#553982', '#28324E', '#000000', '#F7DA64', '#FBA026', '#EB6B56', '#E25041', '#A38F84', '#EFEFEF', '#FFFFFF', '#FAC51C', '#F37934', '#D14841', '#B8312F', '#7C706B', '#D1D5D8'],

        // List settings
        listAdvancedTypes: true,

        // Emoticons
        emoticonsUseImage: true,

        // Events
        events: {
            'initialized': function(this: any) {
                editorRef.current = this;
            },
            'contentChanged': function(this: any) {
                const newContent = this.html.get();
                onChange(newContent);
            }
        }
    };

    return (
        <div className="froala-container" data-document-id={documentId}>
            <FroalaEditorComponent
                tag='textarea'
                config={config}
                model={content}
            />
        </div>
    );
}
