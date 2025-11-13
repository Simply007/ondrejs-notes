import React from 'react';
import './EditorShowcaseStatic.css';
import CKEditorArea from './CKEditorArea';
import TipTapArea from './TipTapArea';
import TinyMCEArea from './TinyMCEArea';
import LexicalArea from './LexicalArea';
import FroalaArea from './FroalaArea';
import QuillArea from './QuillArea';
import SlateArea from './SlateArea';
import ProseMirrorArea from './ProseMirrorArea';
import RemirrorArea from './RemirrorArea';
import SummernoteArea from './SummernoteArea';

// Rich HTML content showcasing various formatting capabilities
const DEMO_CONTENT = `
<h1>Rich Text Editor Showcase</h1>
<p>This is a <strong>demonstration</strong> of various <em>rich text editors</em> available in modern web development. Each editor provides unique features and capabilities for content creation.</p>

<h2>Text Formatting Options</h2>
<p>You can apply <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strikethrough</s>, and even combine them <strong><em><u>all together</u></em></strong>. Some editors support <sup>superscript</sup> and <sub>subscript</sub> text as well.</p>

<h3>Lists and Organization</h3>
<p>Ordered lists are great for instructions:</p>
<ol>
  <li>First, choose your editor</li>
  <li>Then, customize the toolbar</li>
  <li>Finally, start creating content</li>
</ol>

<p>Unordered lists work well for features:</p>
<ul>
  <li>Real-time collaboration</li>
  <li>Markdown support</li>
  <li>Custom plugins and extensions</li>
  <li>Export to multiple formats</li>
</ul>

<h3>Code and Technical Content</h3>
<p>Inline code like <code>const editor = new Editor()</code> is useful for technical documentation.</p>
<pre><code>// Code blocks are essential for developers
function initializeEditor(config) {
  const editor = new RichTextEditor({
    theme: 'modern',
    plugins: ['bold', 'italic', 'lists'],
    toolbar: true
  });
  return editor;
}</code></pre>

<blockquote>
  <p>"The best editor is the one that fits your project's needs and your team's workflow."</p>
  <footer>— Web Development Wisdom</footer>
</blockquote>

<h3>Tables for Data</h3>
<table>
  <thead>
    <tr>
      <th>Editor</th>
      <th>License</th>
      <th>Framework</th>
      <th>Size</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>TipTap</td>
      <td>MIT</td>
      <td>Vue/React</td>
      <td>Modular</td>
    </tr>
    <tr>
      <td>Quill</td>
      <td>BSD</td>
      <td>Vanilla</td>
      <td>~200KB</td>
    </tr>
    <tr>
      <td>Slate</td>
      <td>MIT</td>
      <td>React</td>
      <td>Lightweight</td>
    </tr>
  </tbody>
</table>

<p>Each editor in this showcase processes and displays the same HTML content, allowing you to compare rendering, features, and user experience across different solutions.</p>
`;

const EditorShowcaseStatic: React.FC = () => {
  // Common props for all editors
  const commonProps = {
    documentId: 'showcase-static',
    content: DEMO_CONTENT,
    onChange: () => {
      // No-op for static showcase
      // We don't want content changes in the static view
    }
  };

  const editors = [
    { name: 'CKEditor 5', component: CKEditorArea },
    { name: 'TipTap', component: TipTapArea },
    { name: 'TinyMCE', component: TinyMCEArea },
    { name: 'Lexical', component: LexicalArea },
    { name: 'Quill', component: QuillArea },
    { name: 'Slate', component: SlateArea },
    { name: 'ProseMirror', component: ProseMirrorArea },
    { name: 'Remirror', component: RemirrorArea },
    { name: 'Froala', component: FroalaArea },
    { name: 'Summernote', component: SummernoteArea }
  ];

  return (
    <div className="showcase-static-container">
      <header className="showcase-header">
        <h1>Rich Text Editors Comparison</h1>
        <p>Side-by-side comparison of 10 popular rich text editors rendering the same content</p>
      </header>

      <div className="editors-grid">
        {editors.map(({ name, component: EditorComponent }) => (
          <div key={name} className="editor-showcase-item">
            <div className="editor-label">{name}</div>
            <div className="editor-wrapper">
              <EditorComponent {...commonProps} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorShowcaseStatic;