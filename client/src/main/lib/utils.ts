import { Note } from '../common/types';

export function newNote(title: string): Note {
  return {
    id: pseudoUUID(),
    title,
    body: '',
  };
}

function pseudoUUID() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
