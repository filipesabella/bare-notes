import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { Note } from '../common/types';
import '../styles/sidebar.less';

interface Props {
  notes: Note[];
}

export const SidebarComponent = ({ notes }: Props) => {
  return <div id="sidebar">
    <ul>
      {notes.map(n =>
        <li key={n.id}>
          <NavLink to={`/notes/${n.id}`} exact={true}>{n.title}</NavLink>
        </li>)}
    </ul>
  </div >;
};
