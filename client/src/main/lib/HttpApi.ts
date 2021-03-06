import { Note } from '../common/types';
import { Api } from './Api';
import { Storage } from './Storage';
import { newNote } from './utils';

const API_URL = 'http://localhost:8000/';

export class HttpApi implements Api {
  constructor(
    private readonly storage: Storage,
    private readonly setOffline: (offline: boolean) => void) { }

  public async loadNotes(): Promise<Note[]> {
    try {
      const notes = await this.ffetch<Note[]>('notes');
      return this.storage.store(notes);
    } catch (e) {
      this.setOffline(true);
      return [];
    }
  }

  public loadNote(id: string): Note {
    return this.storage.loadAll().find(n => n.id === id)!;
  }

  public async saveNote(note: Note): Promise<void> {
    try {
      await this.ffetch('notes', {
        method: 'post',
        body: JSON.stringify(note),
      });
      this.storage.save(note);
    } catch (e) {
      this.setOffline(true);
    }
  }

  public async deleteNote(id: string): Promise<void> {
    try {
      await this.ffetch('notes/' + id, { method: 'delete' });
      this.storage.delete(id);
    } catch (e) {
      this.setOffline(true);
    }
  }

  public async createNote(title: string): Promise<Note> {
    const note = newNote(title);
    await this.saveNote(note);
    return note;
  }

  public async sync(): Promise<void> {
    await Promise.all(
      this.storage.loadAll().map(note => this.saveNote(note)));
  }

  public async ping(): Promise<boolean> {
    try {
      await fetch(API_URL);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async ffetch<T = void>(path: string, opts: RequestInit = {})
    : Promise<T> {
    const response = await fetch(API_URL + path, {
      mode: 'cors',
      credentials: 'include',
      ...opts,
    });

    if (response.status === 401) {
      await this.authenticate();
      return this.ffetch(path, opts);
    }

    const isJson = response.headers.get('Content-Type')
      ?.includes('application/json');

    return isJson
      ? await response.json() as T
      : await response.text() as any;
  }

  // nasty implementation of the auth bits below
  private async authenticate(msg = 'Please insert your TOTP code')
    : Promise<boolean> {
    // what year is it
    const code = prompt(msg);

    if (!code) {
      // if the user cancels the authenticatino, clear up all stored data
      this.storage.clear();
      throw 'Could not authenticate';
    }

    const result = await fetch(API_URL + 'authenticate', {
      method: 'post',
      credentials: 'include',
      body: code,
    });

    return result.status === 200
      ? true
      : this.authenticate('Invalid code');
  }
}
