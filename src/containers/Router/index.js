import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import {
  HomePage, DrivePage, ResultsPage, AnalyzePage, SettingsPage, 
  TesterPage, AttachmentPage, WikiPage, PollAppSettingsPage
} from '../../pages'

const Router = () => {

  return (
    <BrowserRouter>
      <Switch>
        <Route path={"/"} exact component={HomePage} />
        <Route path={"/results/:id/:code"} component={ResultsPage} />
        <Route path={"/poll-settings/:id/:code"} component={SettingsPage} />
        <Route path={"/drive/:id/:code"} component={DrivePage} />
        <Route path={"/analyze"} component={AnalyzePage} />
        <Route path={"/attachment/:id/:code"} component={AttachmentPage} />
        <Route path={"/poll-wiki/:id/:code"} component={WikiPage} />
        <Route path={"/pollappsetting"} component={PollAppSettingsPage} />
        <Route path={"/tester"} component={TesterPage} />
      </Switch>
    </BrowserRouter>
  )
}

export default Router