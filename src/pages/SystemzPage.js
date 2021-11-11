import React, { Fragment } from 'react'

import HomeBar from '../components/HomeBar'
import Systemz from '../modules/Systemz'
import PollHome from '../modules/PollHome'

const SystemzPage = () => {

  return (
    <Fragment>
      <HomeBar title={"Система-Z"} />
      <Systemz />
    </Fragment>
  )
}

export default SystemzPage