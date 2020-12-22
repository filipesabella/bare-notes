import { Note } from '../common/types';

const API_URL = 'http://localhost:8000/';

const LOCAL_STORAGE_KEY = 'notes';

export class Api {
  public async loadNotes(): Promise<Note[]> {
    const notes = await ffetch<Note[]>('api/notes');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    return notes;
  }

  public loadNote(id: string): Note {
    return notesFromLocalStorate().find(n => n.id === id)!;
  }

  public async saveNote(note: Note): Promise<void> {
    await ffetch('api/notes', {
      method: 'post',
      body: JSON.stringify(note),
    });
    storeNote(note);
  }

  public async deleteNote(id: string): Promise<void> {
    await ffetch('api/notes/' + id, { method: 'delete' }); localStorage.setItem(
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

async function ffetch<T = void>(path: string, opts: RequestInit = {})
  : Promise<T> {
  const response = await fetch(API_URL + path, {
    mode: 'cors',
    credentials: 'include',
    ...opts,
  });

  if (response.status === 401) {
    let success = false;
    while (!success) {
      success = await authenticate();
    }

    return ffetch(path, opts);
  }

  const isJson = response.headers.get('Content-Type')
    ?.includes('application/json');

  return isJson
    ? await response.json() as T
    : await response.text() as any;
}

async function authenticate(msg = 'Please insert your TOTP code')
  : Promise<boolean> {
  const code = prompt(msg);

  if (!code) {
    localStorage.setItem(LOCAL_STORAGE_KEY, '[]');
    throw 'Could not authenticate';
  }

  const result = await fetch(API_URL + 'authenticate', {
    method: 'post',
    credentials: 'include',
    body: code,
  });

  if (result.status === 200) {
    return true;
  } else {
    return authenticate('Invalid code');
  }
}

function pseudoUUID() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
