import { Note } from '../common/types';
import { Api } from './Api';
import { Storage } from './Storage';
import { newNote } from './utils';

export class OfflineApi implements Api {
  constructor(private readonly storage: Storage) { }

  public loadNotes(): Promise<Note[]> {
    return Promise.resolve(this.storage.loadAll());
  }

  public loadNote(id: string): Note {
    return this.storage.loadAll().find(n => n.id === id)!;
  }

  public saveNote(note: Note): Promise<void> {
    this.storage.save(note);
    return Promise.resolve();
  }

  public deleteNote(id: string): Promise<void> {
    this.storage.delete(id);
    return Promise.resolve();
  }

  public createNote(title: string): Promise<Note> {
    const note = newNote(title);

    this.saveNote(note);
    return Promise.resolve(note);
  }

}
