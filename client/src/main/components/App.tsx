import * as React from 'react';
import { createContext, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Api } from '../lib/api';
import '../styles/app.less';
import { SidebarComponent } from './Sidebar';

const api = new Api();
const context = {
  api,
  setLoading: (_: boolean) => { }
};

const AppContext = createContext(context);

export const App = () => {
  const [loading, setLoading] = useState(false);

  return <div id="app">
    <AppContext.Provider
      value={{
        ...context,
        setLoading,
      }}>
      {loading && <div id="loading">Loading ...</div>}
      <BrowserRouter>
        <div className="content">
          <SidebarComponent />
          <Switch>
            <Route path="/notes/:id" exact={true}>
              <div>hello</div>
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </AppContext.Provider>
  </div >;
};

export const useAppContext = () => React.useContext(AppContext);
