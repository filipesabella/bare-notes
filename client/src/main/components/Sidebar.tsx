import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Note } from '../common/types';
import { Api } from '../lib/Api';
import '../styles/sidebar.less';

interface Props {
  notes: Note[];
  api: Api;
}

export const SidebarComponent = ({ notes, api }: Props) => {
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
