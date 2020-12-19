import * as React from 'react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/sidebar.less';
import { useAppContext } from './App';

export const SidebarComponent = () => {
  const { api } = useAppContext();

  useEffect(() => {
    // api.loadAlbumsForSidebar().then(albums => {
    //   setAlbums(albums.slice(0, 3));
    //   setHasMoreAlbums(albums.length > 3);
    // });
  }, []);

  return <div id="sidebar">
    <ul>
      <li>
        <NavLink to="/" exact={true}>
          hello
        </NavLink>
      </li>
    </ul>
  </div >;
};
