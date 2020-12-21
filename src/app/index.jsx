import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from '../login';
import Chat from '../chat';

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/chat/:recipientId">
          <Chat />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

