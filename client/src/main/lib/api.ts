import { Note } from '../common/types';

const API_URL = 'http://localhost:8000/';

const LOCAL_STORAGE_KEY = 'notes';

interface Result<T> {
  data: T | null;
  authenticatioNeeded: boolean;
}

export class Api {
  public async authenticate(code: string): Promise<boolean> {
    const response = await fetch('authenticate', {
      method: 'post',
      body: code,
    });
    return response.status === 200;
  }

  public async loadNotes(): Promise<Result<Note[]>> {
    const result = await ffetch<Note[]>('api/notes');
    if (!result.authenticatioNeeded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(
        result.data
      ));
    }
    return result;
  }

  public loadNote(id: string): Note {
    return notesFromLocalStorate().find(n => n.id === id)!;
  }

  public async saveNote(note: Note): Promise<Result<void>> {
    storeNote(note);
    return await ffetch('api/notes', {
      method: 'post',
      body: JSON.stringify(note),
    });
  }

  public async deleteNote(id: string): Promise<Result<void>> {
    const result = await ffetch('api/notes/' + id, {
      method: 'delete'
    });
    if (!result.authenticatioNeeded) {
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify(notesFromLocalStorate().filter(n => n.id !== id)));
    }
    return result;
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

async function ffetch<T = void>(path: string, opts: RequestInit = {})
  : Promise<Result<T>> {
  const response = await fetch(API_URL + path, {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    ...opts,
  });

  if (response.status === 401) {
    return {
      data: null,
      authenticatioNeeded: true,
    };
  }

  return {
    data: await response.json() as T,
    authenticatioNeeded: false,
  };
}

function pseudoUUID() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
