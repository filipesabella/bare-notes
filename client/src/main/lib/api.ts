import { Note } from '../common/types';

const API_URL = 'http://localhost:8000/';

const LOCAL_STORAGE_KEY = 'notes';

export class Api {
  public async loadNotes(): Promise<Note[]> {
    const notes = await ffetch<Note[]>('notes');
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    return notes;
  }

  public loadNote(id: string): Note {
    return notesFromLocalStorate().find(n => n.id === id)!;
  }

  public async saveNote(note: Note): Promise<void> {
    await ffetch('notes', {
      method: 'post',
      body: JSON.stringify(note),
    });
    storeNote(note);
  }

  public async deleteNote(id: string): Promise<void> {
    await ffetch('notes/' + id, { method: 'delete' }); localStorage.setItem(
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

// api that does storage ew
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
    await authenticate();
    return ffetch(path, opts);
  }

  const isJson = response.headers.get('Content-Type')
    ?.includes('application/json');

  return isJson
    ? await response.json() as T
    : await response.text() as any;
}

// nasty implementation of the auth bits below
async function authenticate(msg = 'Please insert your TOTP code')
  : Promise<boolean> {
  // what year is it
  const code = prompt(msg);

  if (!code) {
    // if the user cancels the authenticatino, clear up all stored data
    localStorage.setItem(LOCAL_STORAGE_KEY, '[]');
    throw 'Could not authenticate';
  }

  const result = await fetch(API_URL + 'authenticate', {
    method: 'post',
    credentials: 'include',
    body: code,
  });

  return result.status === 200
    ? true
    : authenticate('Invalid code');
}

function pseudoUUID() {
  return 'xxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
