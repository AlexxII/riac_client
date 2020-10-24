import React, { Fragment } from 'react'

import HomeBar from '../components/HomeBar'
import HomeWrap from '../containers/HomeWrap'

const HomePage = () => {

  return (
    <Fragment>
      <HomeBar title={"Опросы"} />
      <HomeWrap />
    </Fragment>
  )
}

export default HomePage