import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import SettingBar from '../components/SettingBar'
import PollWiki from '../modules/PollWiki'

const Wiki = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Wiki ` + code} />
      <Container maxWidth="lg">
        <PollWiki />
      </Container>
    </Fragment>
  )
}

export default Wiki