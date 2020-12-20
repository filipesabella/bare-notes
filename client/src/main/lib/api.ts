import { Note } from '../common/types';

const API_URL = 'http://localhost:8000/';

const LOCAL_STORAGE_KEY = 'notes';

export class Api {
  public async loadNotes(): Promise<Note[]> {
    const response = await ffetch('notes');
    const notes = await response.json() as Note[];

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));

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

  public async deleteNote(id: string): Promise<void> {
    await ffetch('note/' + id, {
      method: 'delete'
    });
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(notesFromLocalStorate().filter(n => n.id !== id)));
  }

  public async createNote(title: string): Promise<Note> {
    const note = {
      id: pseudoUUID(),
      title,
      body: '',
    };
    await this.saveNote(note);
    return note;
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

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
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

function pseudoUUID() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
