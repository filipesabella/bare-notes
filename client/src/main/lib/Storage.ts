import { Note } from '../common/types';

const LOCAL_STORAGE_KEY = 'notes';

export class Storage {
  public loadAll(): Note[] {
    return JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY) || '[]') as Note[];
  }

  public store(notes: Note[]): Note[] {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    return notes;
  }

  public save(note: Note): void {
    let notes = this.loadAll();
    if (notes.find(n => n.id === note.id)) {
      notes = notes.map(n => n.id === note.id ? note : n);
    } else {
      notes = notes.concat(note);
    }

    this.store(notes);
  }

  public delete(id: string): void {
    this.store(
      this.loadAll().filter(n => n.id !== id));
  }

  public clear(): void {
    this.store([]);
  }
}
