import { useEffect, useRef } from 'react';
import $ from 'jquery';

// Import Summernote CSS and JS
import 'summernote/dist/summernote-lite.css';
import 'summernote/dist/summernote-lite.js';

import './SummernoteArea.css';

// Extend JQuery interface to include summernote
interface SummernoteOptions {
  height?: number;
  placeholder?: string;
  toolbar?: unknown[][];
  styleTags?: (string | { title: string; tag: string; value: string })[];
  fontSizes?: string[];
  fontNames?: string[];
  insertTableMaxSize?: { col: number; row: number };
  popover?: Record<string, unknown[][]>;
  dialogsInBody?: boolean;
  dialogsFade?: boolean;
  callbacks?: {
    onChange?: (contents: string) => void;
    onInit?: () => void;
  };
}

declare global {
  interface JQuery {
    summernote(options?: SummernoteOptions): JQuery;
    summernote(method: 'code'): string;
    summernote(method: 'code', value: string): void;
    summernote(method: 'destroy'): void;
    data(key: 'summernote'): unknown;
  }
}

export default function SummernoteArea({
  documentId,
  content,
  onChange
}: {
  documentId: string,
  content: string,
  onChange: (newContent: string) => void
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const onChangeRef = useRef(onChange);
  const contentRef = useRef(content);

  // Keep refs updated
  useEffect(() => {
    onChangeRef.current = onChange;
    contentRef.current = content;
  });

  useEffect(() => {
    if (!editorRef.current || isInitialized.current) return;

    const $editor = $(editorRef.current);

    // Initialize Summernote
    $editor.summernote({
      height: 400,
      placeholder: 'Type something...',
      toolbar: [
        // Text formatting
        ['style', ['style']],  // paragraph, h1-h6, pre, blockquote
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript']],
        ['fontname', ['fontname']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],

        // Paragraph formatting
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],

        // Insert content
        ['insert', ['link', 'picture', 'video', 'table', 'hr']],

        // Misc
        ['view', ['codeview', 'help']],
        ['misc', ['undo', 'redo', 'clear']]
      ],

      // Styles dropdown matching TipTap heading levels
      styleTags: [
        'p',
        { title: 'Heading 1', tag: 'h1', value: 'h1' },
        { title: 'Heading 2', tag: 'h2', value: 'h2' },
        { title: 'Heading 3', tag: 'h3', value: 'h3' },
        { title: 'Heading 4', tag: 'h4', value: 'h4' },
        { title: 'Heading 5', tag: 'h5', value: 'h5' },
        { title: 'Heading 6', tag: 'h6', value: 'h6' },
        'pre',
        'blockquote'
      ],

      // Font sizes
      fontSizes: ['8', '9', '10', '11', '12', '14', '16', '18', '20', '24', '30', '36'],

      // Font names
      fontNames: [
        'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New',
        'Helvetica', 'Impact', 'Tahoma', 'Times New Roman',
        'Verdana', 'Georgia', 'Palatino', 'Garamond'
      ],

      // Table dimensions
      insertTableMaxSize: {
        col: 8,
        row: 8
      },

      // Popover settings
      popover: {
        image: [
          ['image', ['resizeFull', 'resizeHalf', 'resizeQuarter', 'resizeNone']],
          ['float', ['floatLeft', 'floatRight', 'floatNone']],
          ['remove', ['removeMedia']]
        ],
        link: [
          ['link', ['linkDialogShow', 'unlink']]
        ],
        table: [
          ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight']],
          ['delete', ['deleteRow', 'deleteCol', 'deleteTable']]
        ],
        air: [
          ['color', ['color']],
          ['font', ['bold', 'underline', 'clear']],
          ['para', ['ul', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture']]
        ]
      },

      // Dialog options
      dialogsInBody: true,
      dialogsFade: true,

      // Callbacks
      callbacks: {
        onChange: function(contents: string) {
          onChangeRef.current(contents);
        },
        onInit: function() {
          // Set initial content after initialization
          $editor.summernote('code', contentRef.current);
        }
      }
    });

    isInitialized.current = true;

    // Cleanup
    return () => {
      if ($editor.data('summernote')) {
        $editor.summernote('destroy');
      }
      isInitialized.current = false;
    };
  }, []);

  // Update content when prop changes (but not during initial mount)
  useEffect(() => {
    if (!editorRef.current || !isInitialized.current) return;

    const $editor = $(editorRef.current);
    const currentContent: string = $editor.summernote('code');

    // Only update if content is different to avoid cursor jumping
    if (currentContent !== content) {
      $editor.summernote('code', content);
    }
  }, [content]);

  return (
    <div className="summernote-container" data-document-id={documentId}>
      <div ref={editorRef}></div>
    </div>
  );
}
