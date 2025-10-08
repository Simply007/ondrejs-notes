import { generateHTML } from '@tiptap/html';
import axios from 'axios';
import generateSignature from './generateSignature.js';
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import HardBreak from '@tiptap/extension-hard-break'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import Heading from '@tiptap/extension-heading'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import History from '@tiptap/extension-history'
import Typography from '@tiptap/extension-typography'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import Dropcursor from '@tiptap/extension-dropcursor'
import Gapcursor from '@tiptap/extension-gapcursor'
import Youtube from '@tiptap/extension-youtube'
import CodeBlock from '@tiptap/extension-code-block'
import Mention from '@tiptap/extension-mention'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import dotenv from 'dotenv';

dotenv.config();


const inputJson = {
    "type": "doc",
    "content": [
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 1
            },
            "content": [
                {
                    "type": "text",
                    "text": "Welcome to the world of WYSIWYG editors"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "WYSIWYG (What You See Is What You Get) editors allow users to create content visually, without knowing HTML. Below you will find examples of various elements supported by the editor."
                }
            ]
        },
        {
            "type": "horizontalRule"
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Basic Formatting"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ],
                    "text": "This is bold text using <strong>"
                },
                {
                    "type": "text",
                    "text": ", and this is "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "bold"
                        }
                    ],
                    "text": "bold text using <b>"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": ""
                            }
                        },
                        {
                            "type": "bold"
                        }
                    ],
                    "text": "This is bold text using style attribute"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "italic"
                        }
                    ],
                    "text": "This is italic text using <em>"
                },
                {
                    "type": "text",
                    "text": ", and this is "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "italic"
                        }
                    ],
                    "text": "italic text using <i>"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": ""
                            }
                        },
                        {
                            "type": "italic"
                        }
                    ],
                    "text": "This is italic text using style attribute"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "underline"
                        }
                    ],
                    "text": "This is underlined text using <u>"
                },
                {
                    "type": "text",
                    "text": " and "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": ""
                            }
                        },
                        {
                            "type": "underline"
                        }
                    ],
                    "text": "this is underlined using style attribute"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "strike"
                        }
                    ],
                    "text": "This is strikethrough using <s>"
                },
                {
                    "type": "text",
                    "text": ", and this is "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "strike"
                        }
                    ],
                    "text": "using <strike>"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": ""
                            }
                        },
                        {
                            "type": "strike"
                        }
                    ],
                    "text": "This is strikethrough using style attribute"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "This is "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "subscript"
                        }
                    ],
                    "text": "subscript text"
                },
                {
                    "type": "text",
                    "text": ", and this is "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "superscript"
                        }
                    ],
                    "text": "superscript text"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": ""
                            }
                        },
                        {
                            "type": "subscript"
                        }
                    ],
                    "text": "This is subscript text using style attribute"
                },
                {
                    "type": "text",
                    "text": ", and "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": ""
                            }
                        },
                        {
                            "type": "superscript"
                        }
                    ],
                    "text": "this is superscript using style attribute"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "highlight",
                            "attrs": {
                                "color": ""
                            }
                        }
                    ],
                    "text": "This is highlighted text"
                },
                {
                    "type": "text",
                    "text": ", "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "highlight",
                            "attrs": {
                                "color": "red"
                            }
                        }
                    ],
                    "text": "this is highlighted in red"
                },
                {
                    "type": "text",
                    "text": ", and "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "highlight",
                            "attrs": {
                                "color": "#ffa8a8"
                            }
                        }
                    ],
                    "text": "this is highlighted in pink"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Lists and Tasks"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "Here is an unordered list:"
                }
            ]
        },
        {
            "type": "bulletList",
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "First item"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Second item"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Third item"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "Here is an ordered list:"
                }
            ]
        },
        {
            "type": "orderedList",
            "attrs": {
                "start": 1
            },
            "content": [
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "First item"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "listItem",
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Second item"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "Here is a task list:"
                }
            ]
        },
        {
            "type": "taskList",
            "content": [
                {
                    "type": "taskItem",
                    "attrs": {
                        "checked": true
                    },
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Completed task"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "taskItem",
                    "attrs": {
                        "checked": false
                    },
                    "content": [
                        {
                            "type": "paragraph",
                            "attrs": {
                                "textAlign": null
                            },
                            "content": [
                                {
                                    "type": "text",
                                    "text": "Pending task"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Quotes and Code"
                }
            ]
        },
        {
            "type": "blockquote",
            "content": [
                {
                    "type": "paragraph",
                    "attrs": {
                        "textAlign": null
                    },
                    "content": [
                        {
                            "type": "text",
                            "text": "\"A WYSIWYG editor makes life easier!\" — Anonymous"
                        }
                    ]
                }
            ]
        },
        {
            "type": "codeBlock",
            "attrs": {
                "language": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "\nfunction wysiwygDemo() {\n    console.log(\"Welcome to the WYSIWYG demo!\");\n}\n"
                }
            ]
        },
        {
            "type": "codeBlock",
            "attrs": {
                "language": "html"
            },
            "content": [
                {
                    "type": "text",
                    "text": "\n<p>This is an HTML example</p>\n"
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Images and Links"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "Here is an example image:"
                }
            ]
        },
        {
            "type": "image",
            "attrs": {
                "src": "https://placehold.co/600x400",
                "alt": "Demo image",
                "title": null
            }
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "Here is a "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "link",
                            "attrs": {
                                "href": "https://www.google.com",
                                "target": "_blank",
                                "rel": "noopener noreferrer nofollow",
                                "class": null
                            }
                        }
                    ],
                    "text": "link to Google"
                },
                {
                    "type": "text",
                    "text": "."
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Tables"
                }
            ]
        },
        {
            "type": "table",
            "content": [
                {
                    "type": "tableRow",
                    "content": [
                        {
                            "type": "tableHeader",
                            "attrs": {
                                "colspan": 1,
                                "rowspan": 1,
                                "colwidth": null
                            },
                            "content": [
                                {
                                    "type": "paragraph",
                                    "attrs": {
                                        "textAlign": null
                                    },
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Header 1"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "tableHeader",
                            "attrs": {
                                "colspan": 1,
                                "rowspan": 1,
                                "colwidth": null
                            },
                            "content": [
                                {
                                    "type": "paragraph",
                                    "attrs": {
                                        "textAlign": null
                                    },
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Header 2"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "tableRow",
                    "content": [
                        {
                            "type": "tableCell",
                            "attrs": {
                                "colspan": 1,
                                "rowspan": 1,
                                "colwidth": null
                            },
                            "content": [
                                {
                                    "type": "paragraph",
                                    "attrs": {
                                        "textAlign": null
                                    },
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Cell 1"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "tableCell",
                            "attrs": {
                                "colspan": 1,
                                "rowspan": 1,
                                "colwidth": null
                            },
                            "content": [
                                {
                                    "type": "paragraph",
                                    "attrs": {
                                        "textAlign": null
                                    },
                                    "content": [
                                        {
                                            "type": "text",
                                            "text": "Cell 2"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Mentions"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "Hello "
                },
                {
                    "type": "mention",
                    "attrs": {
                        "id": "Sven Adlung",
                        "label": null
                    }
                },
                {
                    "type": "text",
                    "text": ", how are you?"
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "YouTube Video"
                }
            ]
        },
        {
            "type": "youtube",
            "attrs": {
                "src": "https://www.youtube.com/embed/3lTUAWOgoHs",
                "start": 0,
                "width": 560,
                "height": 315
            }
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Advanced Styling"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": "center"
            },
            "content": [
                {
                    "type": "text",
                    "text": "This is centered text."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "rgb(149, 141, 241)",
                                "fontFamily": ""
                            }
                        }
                    ],
                    "text": "This is text with a custom color."
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "textStyle",
                            "attrs": {
                                "color": "",
                                "fontFamily": "Georgia"
                            }
                        }
                    ],
                    "text": "This is text with Georgia font-family."
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 2
            },
            "content": [
                {
                    "type": "text",
                    "text": "Inline Code Example"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "This is "
                },
                {
                    "type": "text",
                    "marks": [
                        {
                            "type": "code"
                        }
                    ],
                    "text": "inline code"
                },
                {
                    "type": "text",
                    "text": " inside a paragraph. "
                },
                {
                    "type": "hardBreak"
                },
                {
                    "type": "text",
                    "text": "And a new line."
                }
            ]
        },
        {
            "type": "heading",
            "attrs": {
                "textAlign": null,
                "level": 3
            },
            "content": [
                {
                    "type": "text",
                    "text": "Summary"
                }
            ]
        },
        {
            "type": "paragraph",
            "attrs": {
                "textAlign": null
            },
            "content": [
                {
                    "type": "text",
                    "text": "WYSIWYG editors offer a lot of flexibility, from simple text formatting to inserting tables, videos, and enhanced mentions like "
                },
                {
                    "type": "mention",
                    "attrs": {
                        "id": "Sven Adlung",
                        "label": null
                    }
                },
                {
                    "type": "text",
                    "text": ". They are essential tools for content creators."
                }
            ]
        }
    ]
};

let inputHtml = generateHTML(inputJson, [
    Document, Paragraph, Text, HardBreak, HorizontalRule,
    Bold, Italic, Strike, Code, Blockquote,
    BulletList, OrderedList, ListItem,
    Heading.configure({ levels: [1, 2, 3] }),
    Link, Image,
    TaskList, TaskItem,
    Table.configure({ resizable: true }),
    TableRow, TableCell, TableHeader,
    Placeholder.configure({ placeholder: 'Type something...' }),
    CharacterCount.configure({ limit: 2000 }),
    History, Typography,
    TextStyle, Highlight.configure({ multicolor: true }), Underline, Subscript, Superscript,
    Dropcursor, Gapcursor, Youtube, CodeBlock,
    Mention.configure(
        {
            HTMLAttributes: { class: 'mention' },
            suggestion: {
                items: () => [],
                render: () => ({
                    onStart: () => { },
                    onUpdate: () => { },
                    onKeyDown: () => false,
                    onExit: () => { },
                }),
            },
            renderText: ({ node }) => `@${node.attrs.label || node.attrs.id}`
        }
    ),
    Color,
    FontFamily,
    TextAlign.configure({ types: ['heading', 'paragraph'] })]
);

const body = {
    "script": `editor.data.set(\`${inputHtml}\`, { suppressErrorInCollaboration: true }); return editor.getData();`,
    "debug": true,
    "config": {
        "cloudServices": {
            "bundleVersion": 'editor-1.0.0' // Should match the version uploaded to Cloud Services
        }
    }
};


const API_SECRET = process.env.SCRIPTS_CK_EDITOR_API_SECRET;
const API_ENDPOINT = process.env.SCRIPTS_CK_EDITOR_APPLICATION_ENDPOINT;
const ENVIRONMENT_ID = process.env.SCRIPTS_CK_EDITOR_ENVIRONMENT_ID;

const API_BASE_URL = `${API_ENDPOINT}/api/v5/${ENVIRONMENT_ID}`
// Document with documentId had to be created in the CKEditor Cloud Services environment beforehand
const documentId = 'test1';
const EVALUATE_SCRIPT_URL_PATH = `/collaborations/${documentId}/evaluate-script`

const timestamp = Date.now();
const signature = generateSignature(
    API_SECRET,
    'POST',
    API_BASE_URL + EVALUATE_SCRIPT_URL_PATH,
    timestamp,
    body
);

try {
    const response = await axios.post(
        API_BASE_URL + EVALUATE_SCRIPT_URL_PATH,
        body,
        {
            headers: {
                'Content-Type': 'application/json',
                'X-CS-Timestamp': timestamp,
                'X-CS-Signature': signature,
            },
        }
    );
    console.log('Response:', response.data);
} catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
}