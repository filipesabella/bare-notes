import { Note } from '../common/types';

const API_URL = 'http://localhost:8000/';

export class Api {
  public async loadNotes(): Promise<Note[]> {
    const response = await ffetch('notes');
    const notes = await response.json() as Note[];

    localStorage.setItem('notes', JSON.stringify(notes));

    return notes;
  }

  public loadNote(id: string): Note {
    return notesFromLocalStorate().find(n => n.id === id)!;
  }

  public async saveNote(note: Note): Promise<void> {
    storeNote(note);
    await ffetch('note', {
      method: 'post',
      body: JSON.stringify(note),
    });
  }
}

function notesFromLocalStorate(): Note[] {
  return JSON.parse(localStorage.getItem('notes') || '[]') as Note[];
}

function storeNote(note: Note): void {
  let notes = notesFromLocalStorate();
  if (notes.find(n => n.id === note.id)) {
    notes = notes.map(n => n.id === note.id ? note : n);
  } else {
    notes = notes.concat(note);
  }

  localStorage.setItem('ntes', JSON.stringify(notes));
}

async function ffetch(path: string, opts: RequestInit = {}): Promise<Response> {
  return await fetch(API_URL + path, {
    mode: 'cors',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    ...opts,
  });
}
