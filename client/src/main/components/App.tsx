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

  useEffect(() => {
    api.loadNotes().then(setNotes);
  }, []);

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
