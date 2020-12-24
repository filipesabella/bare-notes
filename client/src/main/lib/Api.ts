import { Note } from '../common/types';

export interface Api {
  loadNotes(): Promise<Note[]>;
  loadNote(id: string): Note;
  saveNote(note: Note): Promise<void>;
  deleteNote(id: string): Promise<void>;
  createNote(title: string): Promise<Note>;
}
