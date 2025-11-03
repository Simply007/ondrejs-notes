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
* Time to Hello world is significantly higher because you need to learn editor and then Component UI/UI integration setup
  * On the other hand you explore more possibilities before you move forward
  * Vite startup does not work for TipTap UI - I am using standard Vite setup
* The docs is a bit perplexing - multiple ways to create menu, floating menu , bubble menu
  * Was confusing to distinguish what s Template, UI Component, Extension for Editor 
    * Plus the concept of Provide, Documents
* React and Vue being the first class citizen + Vite + Next for bundlers -> other is manual
* What is Node and what is mark - the abstraction is missing and pretty close to actual HTML/Markup languages


## CKEditor notes

* When You want to make the selectable editor - the CKEditor does not load the data properly
  * It loads the initial data, but right after it loads the latest data based on the documentId - https://ckeditor.com/docs/ckeditor5/latest/support/error-codes.html#error-editor-initial-data-replaced-with-revision-data 
* See. `handleConflictResolution` in CKEditorArea.tsx

