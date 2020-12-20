import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Note } from '../common/types';
import '../styles/sidebar.less';
import { useAppContext } from './App';

interface Props {
  notes: Note[];
}

export const SidebarComponent = ({ notes }: Props) => {
  const { api } = useAppContext();

  const createNote = async () => {
    const title = prompt('Title') || '';
    if (title.trim()) {
      const note = await api.createNote(title);
      window.location.href = `/notes/${note.id}`;
    }
  };

  return <div id="sidebar">
    <ul>
      {notes.map(n =>
        <li key={n.id}>
          <NavLink to={`/notes/${n.id}`} exact={true}>{n.title}</NavLink>
        </li>)}
    </ul>
    <button onClick={() => createNote()}>Add new</button>
  </div>;
};
