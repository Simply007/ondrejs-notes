export type Note = {
  guid: string;
  title: string; // max 200 chars
  content: string; // TipTap content (HTML)
  ckEditorContent?: string; // CKEditor migrated content (optional)
  created: number; // timestamp
  modified: number; // timestamp
} 