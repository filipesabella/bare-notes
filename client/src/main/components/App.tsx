import * as React from 'react';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Note } from '../common/types';
import { Api } from '../lib/api';
import '../styles/app.less';
import { NoteComponent } from './Note';
import { SidebarComponent } from './Sidebar';

const api = new Api();
const context = {
  api,
  setLoading: (_: boolean) => { }
};

const AppContext = createContext(context);

export const App = () => {
  const [notes, setNotes] = useState(null as Note[] | null);

  const authenticate = async (msg = 'Please insert your TOTP code') => {
    const code = prompt(msg);

    if (!code) return;

    const success = await api.authenticate(code || '');
    if (success) {
      loadNotes();
    } else {
      authenticate('Invalid code');
    }
  };

  const loadNotes = () => {
    api.loadNotes().then(async result => {
      if (result.authenticatioNeeded) {
        await authenticate();
      } else {
        setNotes(result.data!);
      }
    });
  };

  useEffect(loadNotes, []);

  return <div id="app">
    <AppContext.Provider
      value={context}>
      <BrowserRouter>
        <div className="content">
          {notes && <SidebarComponent notes={notes} />}
          {notes && <Switch>
            <Route path="/notes/:id" exact={true}>
              <NoteComponent />
            </Route>
          </Switch>}
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  </div>;
};

export const useAppContext = () => React.useContext(AppContext);
