import * as fs from 'fs';
import { Note } from './common/types';

const db = '/tmp/notes-db.json';

export class Repository {
  constructor() { }

  public loadNotes(): Note[] {
    return JSON.parse(fs.readFileSync(db).toString()) as Note[];
  }

  public save(note: Note): void {
    let notes = this.loadNotes();

    if (notes.find(n => n.id === note.id)) {
      notes = notes.map(n => n.id === note.id ? note : n);
    } else {
      notes = notes.concat(note);
    }

    fs.writeFileSync(db, JSON.stringify(notes));
  }

  public delete(id: string): void {
    fs.writeFileSync(db, JSON.stringify(
      this.loadNotes().filter(n => n.id !== id)));
  }
}
