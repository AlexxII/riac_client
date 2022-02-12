import React from 'react'
import { BrowserRouter, Route, Routes} from 'react-router-dom'

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
  UpdateResultsPage,
  SystemzPage
} from '../../pages'

const Router = () => {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/poll-archive" element={<PollArchive/>} />
        <Route path="/settings/users" element={<UsersPage/>} />
        <Route path="/settings/user-profile/:id" element={<UserProfilePage/>} />
        <Route path="/results/:id/:code" element={<ResultsPage/>} />
        <Route path="/poll-settings/:id/:code" element={<SettingsPage/>} />
        <Route path="/drive/:id/:code" element={<DrivePage/>} />
        <Route path="/analyze" element={<AnalyzePage/>} />
        <Route path="/attachment/:id/:code" element={<AttachmentPage/>} />
        <Route path="/poll-wiki/:id/:code" element={<WikiPage/>} />
        <Route path="/poll-app-settings" element={<PollAppSettingsPage/>} />
        <Route path="/tester" element={<TesterPage/>} />
        <Route path="/update-result/:poll/:respondent" element={<UpdateResultsPage/>} />
        <Route path="/systemaz" element={<SystemzPage/>} />
        <Route path="*" element={<NotFoundPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router