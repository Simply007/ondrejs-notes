import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, saveNotes, generateGUID } from './utils';
import type { Note } from './types';

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [debugMode, setDebugMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setNotes(getNotes());

    // Check for ?debug=true in URL
    const urlParams = new URLSearchParams(window.location.search);
    setDebugMode(urlParams.get('debug') === 'true');
  }, []);

  const handleNewTiptapNote = () => {
    const now = Date.now();
    const newNote: Note = {
      guid: generateGUID(),
      title: '',
      content: '',
      created: now,
      modified: now,
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setNotes(updatedNotes);
    navigate(`/note/${newNote.guid}`);
  };

  const handleNewCKEditorNote = () => {
    const now = Date.now();
    const newNote: Note = {
      guid: generateGUID(),
      title: '',
      content: null, // null = CKEditor-only note (no Tiptap version)
      ckEditorContent: '', // Pre-set to mark as CKEditor note
      created: now,
      modified: now,
    };
    const updatedNotes = [newNote, ...notes];
    saveNotes(updatedNotes);
    setNotes(updatedNotes);
    navigate(`/note/${newNote.guid}`);
  };

  const handleDelete = (guid: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    const updatedNotes = notes.filter((note) => note.guid !== guid);
    saveNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  const handleMigrate = (note: Note) => {
    if (!window.confirm('Migrate this note to CKEditor? The original Tiptap content will be preserved as read-only.')) {
      return;
    }

    const updatedNote = {
      ...note,
      ckEditorContent: note.content,
      modified: Date.now(),
    };

    const updatedNotes = notes.map((n) => n.guid === note.guid ? updatedNote : n);
    saveNotes(updatedNotes);
    setNotes(updatedNotes);
  };

  const handleGenerateSampleNotes = async () => {
    if (!window.confirm('Generate sample notes? This will add notes to your local storage.')) {
      return;
    }

    try {
      // Fetch pre-generated sample notes
      const response = await fetch('/sample-notes.json');
      if (!response.ok) {
        throw new Error('Failed to fetch sample notes');
      }
      const sampleNotes: Note[] = await response.json();

      const currentNotes = getNotes();
      const updatedNotes = [...sampleNotes, ...currentNotes];
      saveNotes(updatedNotes);
      setNotes(updatedNotes);

      alert(`Added ${sampleNotes.length} sample notes!`);
    } catch (error) {
      console.error('Error generating notes:', error);
      alert('Failed to generate sample notes. Check console for details.');
    }
  };

  return (
    <div className="notes-list-container">
      <div className="notes-header">
        <h1>Notes</h1>
        <div className="new-note-buttons">
          <button className="new-note-btn tiptap" onClick={handleNewTiptapNote}>
            + Tiptap Note
          </button>
          <button className="new-note-btn ckeditor" onClick={handleNewCKEditorNote}>
            + CKEditor Note
          </button>
          {debugMode && (
            <button className="new-note-btn debug" onClick={handleGenerateSampleNotes}>
              🔧 Generate Sample Notes
            </button>
          )}
        </div>
      </div>
      <div className="notes-tiles">
        {notes.length === 0 && <p>No notes yet.</p>}
        {notes.map((note) => (
          <div className="note-tile" key={note.guid}>
            <div className="note-tile-content" onClick={() => navigate(`/note/${note.guid}`)}>
              <div className="note-tile-header">
                <h2>{note.title || <em>(No Title)</em>}</h2>
                <span className={`editor-badge ${note.content === null || note.ckEditorContent ? 'ckeditor' : 'tiptap'}`}>
                  {note.content === null || note.ckEditorContent ? 'CKEditor' : 'Tiptap'}
                </span>
              </div>
              <p className="note-preview" dangerouslySetInnerHTML={{__html: (note.content || '').slice(0, 50) + '...'}}/>
            </div>
            <div className="note-tile-actions">
              {note.content !== null && !note.ckEditorContent && (
                <button
                  className="migrate-btn-small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMigrate(note);
                  }}
                >
                  Migrate
                </button>
              )}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(note.guid);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 