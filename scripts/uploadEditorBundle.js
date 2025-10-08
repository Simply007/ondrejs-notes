import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import generateSignature from './generateSignature.js';
import dotenv from 'dotenv';

dotenv.config();


const environmentId = process.env.SCRIPTS_CK_EDITOR_ENVIRONMENT_ID;
const apiSecret = process.env.SCRIPTS_CK_EDITOR_API_SECRET;
const applicationEndpoint = process.env.SCRIPTS_CK_EDITOR_APPLICATION_ENDPOINT;

const apiEndpoint = `${applicationEndpoint}/api/v5/${environmentId}/editors/`;
const editorBundle = fs.readFileSync(path.resolve('./dist/editor.bundle.js'));

const body = {
    bundle: editorBundle.toString(),
    config: {
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
        // initialData: "dummyContent",
        // licenseKey: LICENSE_KEY,
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
        sourceEditing: {
            allowCollaborationFeatures: true
        },
        cloudServices: {
            bundleVersion: 'editor-1.0.0' // Set a unique name for the uploaded bundle
        },
    }
};

const CSTimestamp = Date.now();
const axiosConfig = {
    headers: {
        'X-CS-Timestamp': CSTimestamp,
        'X-CS-Signature': generateSignature(apiSecret, 'POST', apiEndpoint, CSTimestamp, body)
    }
};

axios.post(apiEndpoint, body, axiosConfig)
    .then(response => {
        console.log(response.status);
    }).catch(error => {
        console.log(error.message);
        console.log(error.response.data);
    });



