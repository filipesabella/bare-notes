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


export const App = () => {
  const [notes, setNotes] = useState(null as Note[] | null);
  const [offline, setOffline] = useState(false);

  const storage = new Storage();
  const httpApi = new HttpApi(storage, setOffline);
  const offlineApi = new OfflineApi(storage);

  const [api, setApi] = useState(httpApi as Api);

  useEffect(() => {
    api.loadNotes().then(setNotes);
  }, []);

  useEffect(() => {
    if (offline) {
      setApi(offlineApi);
      offlineApi.loadNotes().then(setNotes);

      const intervalId = window.setInterval(() => {
        httpApi.ping().then(online => {
          if (online) {
            window.clearInterval(intervalId);
            setOffline(false);
            httpApi.sync();
            setApi(httpApi);
          }
        });
      }, 1000);
    }
  }, [offline]);

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
