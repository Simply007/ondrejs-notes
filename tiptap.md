# Tiptap Notes

* Tiptap: https://tiptap.dev/
* Based on [ProseMirror](https://prosemirror.net/)
  * TipTap does not sponsor ProseMirror: https://prosemirror.net/backers.html
    * 💡 We might wanna target these backers with some campaign?mConected 
* You need to implement the UI yourself
  * Accessibility - to navigate the menu with keyboard
  * Has ARIA attrs
  * Keyboard shortcuts
  * Load the icons - ideally have it maintained
* Time to Hello worls is significantly higher because you need to lear editor and then Component UI/UI untegration setup
  * On the other hand you explore more possibilitiess before you move forward
  * Vite startup does not work forTipTap UI - I am useing standard Vite setup
* The docs is a bit perplexing - multiple ways to create menu, floating menu , bubble menu
  * Was confusing to distinguish what s Template, UI Component, Extension for Editor 
    * Plus the concept of Provide, Documents
* React and Vue being the first class citizen + Vite + Next for bundlers -> other is manual
* What is Node and what is mark - the abstraction is missing and pretty close to actual HTML/Markup languages


## CKEditor notes

* When YOu want to make the selectable editor - the CKEditor does not load the data properly
  * It loads the initial data, but right after it loads the latest data based on the documentId - https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-editor-initial-data-replaced-with-revision-data 
* See. `handleConflictResolution` in CKEditorArea.tsx

## Comparison info fot the Blog "Best React WYSIWYG Editor"

* See on competitors -> and see the articles that clicks "Best WYSIWYG Editor"
* Szymon - can you give me the articles I can base the React comparison
  * https://www.contentful.com/blog/react-rich-text-editor/
  * https://dev.to/joodi/10-top-rich-text-editors-for-react-developers-in-2025-5a2m
  * https://froala.com/blog/general/10-essential-tools-for-visual-html-editor-workflows-in-react-on-2025/
  * https://code-b.dev/blog/rich-text-editors-react
  * https://blog.logrocket.com/best-text-editors-react/


Objective comparison: 
* Table to comparison - OK to use CKEditor as a base
* Pros and cons can be an option, but mostly everybody is using them

Aim for the screenshot for every editor -> and keep the content Unified ideally
-> always notes UI as a base with the same content

Time to Hello world - we will see -> I will do it, measure it and see whether we include it
Last release - measure
-> for Framework it does not really make sense -> the wrapper 
-> Let!s skip for frameworks
Features coverage - do not so tat for Frameworks
* Do not focus on many features (tens) -> Aim to ~5 + aim to one more extra with the others
* ~3-4 features tht articels repeat + 1-2 my own CK is good at
* Have the reactions from the outside events
React Compatibility React LTS, 18, 19, how long did it take for editor to release the wrapper after the new react is out 


## Migrate from TipTap to CKEditor

Based on https://www.notion.so/Blog-post-How-To-Migrate-From-TipTap-to-CKEditor-5-1a8bb9a6723280e1b320dee4724c917a#1a8bb9a6723280e1b320dee4724c917a 

SEO: They want to see the instruction straight away!
https://www.tiny.cloud/blog/migrate-from-tiptap-to-tinymce/ 


Aim to use case:
* PPL Using TipTap and have the document i.e. in the database identified by some ID
* Situation from the company having the data in DB built using TipTap -> want to irteratively migrate to CK  - idealy with some "migration" perios allowing both at the same time (if possible)
* Do not repeat info we might have somewhere else (Docs, ...)
* Aim for 3 steps upgrade => for iterative approach
* Record the gifs/process

For keyword "TipTap alternative": https://www.tiny.cloud/tinymce-vs-tiptap/ => this is for comparison page