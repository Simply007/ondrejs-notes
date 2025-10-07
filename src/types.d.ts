export type Note = {
  guid: string;
  title: string; // max 200 chars
  content: string | null; // TipTap content (HTML), null = CKEditor-only note
  ckEditorContent?: string; // CKEditor content (for migrated or CKEditor-only notes)
  created: number; // timestamp
  modified: number; // timestamp
} 