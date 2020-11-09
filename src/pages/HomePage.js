import React, { Fragment } from 'react'

import HomeBar from '../components/HomeBar'
import PollHome from '../modules/PollHome'

const HomePage = () => {

  return (
    <Fragment>
      <HomeBar title={"Опросы"} />
      <PollHome />
    </Fragment>
  )
}

export default HomePage