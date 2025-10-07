#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parse command-line arguments
const args = process.argv.slice(2);
let count = 15;
let includeSamples = true;

args.forEach(arg => {
  if (arg.startsWith('--count=')) {
    count = parseInt(arg.split('=')[1], 10);
  }
  if (arg === '--no-samples') {
    includeSamples = false;
  }
});

// Load sample notes if enabled
let notes = [];
if (includeSamples) {
  const samplesPath = path.join(__dirname, '../assets/sampleNotes.json');
  try {
    notes = JSON.parse(fs.readFileSync(samplesPath, 'utf-8'));
  } catch (error) {
    console.error('Warning: Could not load sample notes from assets/sampleNotes.json');
  }
}

// Helper function to generate GUID
function generateGUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Sample content templates
const sampleTitles = [
  'Meeting Notes', 'Project Ideas', 'Shopping List', 'Todo for Today',
  'Book Recommendations', 'Recipe: Pasta', 'Travel Plans', 'Budget 2025',
  'Workout Routine', 'Learning Resources', 'Gift Ideas', 'Weekly Review',
  'Code Snippets', 'Design Inspiration', 'Research Notes'
];

const sampleContentTipTap = [
  '<p>This is a <strong>TipTap</strong> note with <em>formatted</em> text.</p><ul><li><p>List item 1</p></li><li><p>List item 2</p></li></ul>',
  '<h2>Section Title</h2><p>Some paragraph content here with <u>underlined</u> text.</p>',
  '<p>Plain text note with a <a href="https://example.com">link</a>.</p>',
  '<blockquote><p>A quote from someone important.</p></blockquote><p>Regular text below.</p>',
  '<pre><code>const example = "code block";\nconsole.log(example);</code></pre>',
];

const sampleContentCKEditor = [
  '<p>This is a <strong>CKEditor</strong> note with <i>rich</i> formatting.</p><ul><li>Item one</li><li>Item two</li></ul>',
  '<h2>CKEditor Heading</h2><p>Content with <u>various</u> <s>formatting</s> options.</p>',
  '<p>CKEditor supports tables and advanced features.</p><figure class="table"><table><tbody><tr><td>Cell 1</td><td>Cell 2</td></tr></tbody></table></figure>',
  '<blockquote><p>CKEditor quote block</p></blockquote><p>More content here.</p>',
  '<p><mark>Highlighted text</mark> in CKEditor.</p>',
];

// Generate additional notes
for (let i = 0; i < count; i++) {
  const noteType = Math.floor(Math.random() * 3); // 0=TipTap, 1=CKEditor-only, 2=Migrated
  const now = Date.now() + i;
  const title = sampleTitles[i % sampleTitles.length] + ` #${i + 1}`;

  if (noteType === 0) {
    // TipTap note
    const content = sampleContentTipTap[Math.floor(Math.random() * sampleContentTipTap.length)];
    notes.push({
      guid: generateGUID(),
      title: `${title} [TipTap]`,
      content: content,
      created: now,
      modified: now
    });
  } else if (noteType === 1) {
    // CKEditor-only note (content: null)
    const content = sampleContentCKEditor[Math.floor(Math.random() * sampleContentCKEditor.length)];
    notes.push({
      guid: generateGUID(),
      title: `${title} [CKEditor]`,
      content: null,
      ckEditorContent: content,
      created: now,
      modified: now
    });
  } else {
    // Migrated note (both content and ckEditorContent)
    const tipTapContent = sampleContentTipTap[Math.floor(Math.random() * sampleContentTipTap.length)];
    const ckContent = sampleContentCKEditor[Math.floor(Math.random() * sampleContentCKEditor.length)];
    notes.push({
      guid: generateGUID(),
      title: `${title} [Migrated]`,
      content: tipTapContent,
      ckEditorContent: ckContent,
      created: now,
      modified: now
    });
  }
}

// Output as JSON
console.log(JSON.stringify(notes, null, 2));
