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

  const saveInApi = useRef(throttle(api.saveNote));

  const updateNote = (body: string) => {
    setNote(n => ({ ...n!, body }));
    saveInApi.current && saveInApi.current({
      ...note!,
      body,
    });
  };

  return <div id="note">
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
    timeoutId = setTimeout(() => fn(note), 1000);
  };
}