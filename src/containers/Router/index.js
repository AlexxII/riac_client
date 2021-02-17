import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import {
  HomePage,
  PollArchive,
  DrivePage,
  ResultsPage,
  AnalyzePage,
  SettingsPage,
  TesterPage,
  AttachmentPage,
  WikiPage,
  PollAppSettingsPage,
  UsersPage,
  UserProfilePage,
  NotFoundPage,
  UpdateResultsPage
} from '../../pages'

const Router = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact component={HomePage} />
        <Route path={"/poll-archive"} exact component={PollArchive} />
        <Route path={"/settings/users"} exact component={UsersPage} />
        <Route path={"/settings/user-profile/:id"} exact component={UserProfilePage} />
        <Route path={"/results/:id/:code"} component={ResultsPage} />
        <Route path={"/poll-settings/:id/:code"} component={SettingsPage} />
        <Route path={"/drive/:id/:code"} component={DrivePage} />
        <Route path={"/analyze"} component={AnalyzePage} />
        <Route path={"/attachment/:id/:code"} component={AttachmentPage} />
        <Route path={"/poll-wiki/:id/:code"} component={WikiPage} />
        <Route path={"/poll-app-settings"} component={PollAppSettingsPage} />
        <Route path={"/tester"} component={TesterPage} />
        <Route path={"/update-result/:poll/:respondent"} component={UpdateResultsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router