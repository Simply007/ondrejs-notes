import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { generateGUID, getNotes, saveNotes } from './utils';
import type { Note } from './types';
import RichText from './components/RichText';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | undefined>();
  const [selectedEditor, setSelectedEditor] = useState<'Tiptap' | 'CKEditor'>('Tiptap');

  useEffect(() => {
    if(!id) {
      navigate('/');
      return;
    }
    const found = getNotes().find((n) => n.guid === id);
    if (!found) {
      const now = Date.now();
      const new_note = {
        guid: id,
        // The title is not shared - you can have your own naming
        title: '[SHARED] New note',
        // Leave this empty - the content will be loaded based on the ID from CKEditor server
        content: '',
        created: now,
        modified: now,
      };
      setNote(new_note);
    } else {
      setNote(found);
      // If note is migrated, default to CKEditor view
      if (found.ckEditorContent) {
        setSelectedEditor('CKEditor');
      }
    }
  }, [id, navigate]);

  const handleMigrateToCKEditor = () => {
    if (!note || !window.confirm('Migrate this note to CKEditor? The original Tiptap content will be preserved as read-only.')) {
      return;
    }

    const updatedNote = {
      ...note,
      ckEditorContent: note.content || '', // Copy Tiptap content as starting point, convert null to empty string
      modified: Date.now(),
    };

    setNote(updatedNote);

    const currentNotes = getNotes();
    const newNotes = currentNotes.map((n: Note) => n.guid === note.guid ? updatedNote : n);
    saveNotes(newNotes);

    setSelectedEditor('CKEditor');
  };

  const handleChange = (field: keyof Note, value: string) => {
    if (!note) return;

    let updatedNote: Note;
    if (field === 'content') {
      // CKEditor-only notes (content === null): always save to ckEditorContent
      if (note.content === null && note.ckEditorContent !== undefined) {
        updatedNote = {
          ...note,
          ckEditorContent: value,
          modified: Date.now(),
        };
      }
      // Migrated notes: save to appropriate field based on selected editor
      else if (note.ckEditorContent && selectedEditor === 'CKEditor') {
        updatedNote = {
          ...note,
          ckEditorContent: value,
          modified: Date.now(),
        };
      }
      // Tiptap notes: save to content
      else {
        updatedNote = {
          ...note,
          content: value,
          modified: Date.now(),
        };
      }
    } else {
      updatedNote = {
        ...note,
        [field]: field === 'title' ? value.slice(0, 200) : value,
        modified: Date.now(),
      };
    }

    setNote(updatedNote);

    const exists = (notes: Note[], guid: string) => notes.some(n => n.guid === guid);
    const currentNotes = getNotes();

    const newNotes = exists(currentNotes, note.guid)
      ? currentNotes.map((n: Note) => (n.guid === note.guid ? updatedNote : n))
      : [...currentNotes, updatedNote];

    saveNotes(newNotes);
  };

  if (!note) return null;

  return (
    <div className="note-detail-container">
      <button className="back-btn" onClick={() => navigate('/')}>Back</button>

      {/* Show migrate button only for non-migrated Tiptap notes (not CKEditor-only) */}
      {note.content !== null && !note.ckEditorContent && (
        <div className="migration-controls">
          <button
            className="migrate-btn"
            onClick={handleMigrateToCKEditor}
          >
            Migrate to CKEditor
          </button>
        </div>
      )}

      <div className="note-detail-form">
        <input
          className="note-title-input"
          type="text"
          value={note.title}
          maxLength={200}
          placeholder="Title"
          onChange={(e) => handleChange('title', e.target.value)}
        />

        <RichText
          documentId={id || generateGUID()}
          content={note.content}
          ckEditorContent={note.ckEditorContent}
          isMigrated={!!note.ckEditorContent}
          selectedEditor={selectedEditor}
          onEditorChange={setSelectedEditor}
          onChange={(content) => handleChange('content', content)}
        />

        <div className="note-timestamps">
          <small>Created: {new Date(note.created).toLocaleString()}</small>
          <small>Last modified: {new Date(note.modified).toLocaleString()}</small>
        </div>
      </div>
    </div>
  );
} 