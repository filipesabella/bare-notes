import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Note } from '../common/types';
import '../styles/note.less';
import { useAppContext } from './App';

export const NoteComponent = () => {
  const { api } = useAppContext();
  const { id } = useParams<{ id: string }>();

  const [note, setNote] = useState(null as Note | null);

  useEffect(() => {
    setNote(api.loadNote(id));
  }, [id]);

  const saveNote = useRef(throttle(api.saveNote));

  const updateNote = (body: string) => {
    setNote(n => ({ ...n!, body }));
    saveNote.current && saveNote.current({
      ...note!,
      body,
    });
  };

  const updateTitle = (title: string) => {
    setNote(n => ({ ...n!, title }));
    saveNote.current && saveNote.current({
      ...note!,
      title,
    });
  };

  const validateTitle = async () => {
    if (!note) return;

    if (note.title === '') {
      if (confirm('Delete note?')) {
        await api.deleteNote(note.id);
        window.location.href = '/';
      } else {
        updateTitle('a');
      }
    }
  };

  return <div id="note">
    {note && <input
      value={note.title}
      onChange={e => updateTitle(e.target.value)}
      onBlur={() => validateTitle()}></input>}
    {note && <textarea
      autoFocus
      value={note.body}
      spellCheck={false}
      onChange={e => updateNote(e.target.value)}></textarea>}
  </div>;
};

function throttle(fn: (note: Note) => void) {
  let timeoutId: number;
  return (note: Note) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(note), 500);
  };
}
