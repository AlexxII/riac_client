import React, { Fragment } from 'react'

import Container from '@material-ui/core/Container';

import SettingBar from '../components/SettingBar'
import PollArchive from '../modules/PollArchive'

const HomePage = () => {

  return (
    <Fragment>
      <SettingBar title={'Архив опросов'} />
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          <PollArchive />
        </Container>
      </div>
    </Fragment>
  )
}

export default HomePage