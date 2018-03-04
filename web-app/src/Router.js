import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import RequireLogin from './components/RequireLogin';
import AudienceHomePage from './components/AudienceHomePage';
import EventRoomPage from './components/EventRoomPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import AdminQuestionPage from './components/AdminQuestionPage';
import AdminLoginPage from './components/AdminLoginPage';

export default () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={AudienceHomePage} />
      <Route exact path="/event/:eventCode" component={EventRoomPage} />
      <Route exact path="/admin/events" component={RequireLogin(AdminDashboardPage)} />
      <Route exact path="/admin/event/:eventCode" component={RequireLogin(AdminQuestionPage)} />
      <Route exact path="/admin/login" component={AdminLoginPage} />
    </Switch>
  </BrowserRouter>
);
