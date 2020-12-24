import * as React from 'react';
import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Note } from '../common/types';
import { Api } from '../lib/Api';
import { HttpApi } from '../lib/HttpApi';
import { OfflineApi } from '../lib/OfflineApi';
import { Storage } from '../lib/Storage';
import '../styles/app.less';
import { NoteComponent } from './Note';
import { SidebarComponent } from './Sidebar';

const storage = new Storage();
const httpApi = new HttpApi(storage);
const offlineApi = new OfflineApi(storage);

export const App = () => {
  const [notes, setNotes] = useState(null as Note[] | null);
  const [offline, setOffline] = useState(false);
  const [api, setApi] = useState(httpApi as Api);

  useEffect(() => {
    api.loadNotes()
      .then(setNotes)
      .catch(() => {
        setOffline(true);

        setApi(offlineApi);

        offlineApi.loadNotes().then(setNotes);
      });
  }, []);

  return <div id="app">
    <BrowserRouter>
      <div className="content">
        {notes && <SidebarComponent api={api} notes={notes} />}
        {notes && <Switch>
          <Route path="/notes/:id" exact={true}>
            <NoteComponent api={api} />
          </Route>
        </Switch>}

        {offline && <div className="offline">Offline Mode</div>}
      </div>
    </BrowserRouter>
  </div>;
};
