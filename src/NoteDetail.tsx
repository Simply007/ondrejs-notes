import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { generateGUID, getNotes, saveNotes } from './utils';
import type { Note } from './types';
import RichText from './components/RichText';

export default function NoteDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | undefined>();

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
    }
  }, [id, navigate]);

  const handleChange = (field: keyof Note, value: string) => {
    if (!note) return;
    const updatedNote = {
      ...note,
      [field]: field === 'title' ? value.slice(0, 200) : value,
      modified: Date.now(),
    };
    setNote(updatedNote);
    
    const exists = (notes: Note[], quid: string) => notes.some(n => n.guid === quid)
    const currentNotes = getNotes()

    const newNotes = exists(currentNotes, note.guid)
      ? currentNotes.map((n: Note) => (n.guid === note.guid ? updatedNote : n))
      : [...currentNotes, updatedNote]

    saveNotes(newNotes);
  };

  if (!note) return null;

  return (
    <div className="app-container">
      <div className="note-detail-container">
      <button className="back-btn" onClick={() => navigate('/')}>Back</button>
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
          onChange={(content) => handleChange('content', content)}
        />
        <div className="note-timestamps">
          <small>Created: {new Date(note.created).toLocaleString()}</small>
          <small>Last modified: {new Date(note.modified).toLocaleString()}</small>
        </div>
      </div>
    </div>
    </div>
  );
} 