import React, { Fragment, useState } from 'react'

import AdaptiveTabs from '../../components/AdaptiveTabs'
import CommonUserSettings from './containers/CommonUserSettings'
import UserPollSettings from './containers/UserPollSettings'

const UserProfile = ({ id }) => {

  const data = [
    {
      label: 'Общие',
      component: <CommonUserSettings id={id} />
    },
    {
      label: 'Опросы',
      component: <UserPollSettings id={id} />
    }
  ]
  return (
    <Fragment>
      <AdaptiveTabs data={data} />
    </Fragment>
  )
}

export default UserProfile