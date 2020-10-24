import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import SettingBar from '../components/SettingBar'
import PollResults from '../modules/PollResults'

const Results = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Результаты ` + code} />
      <div style={{ paddingTop: '10px' }}>
        <Container maxWidth="xl">
          <PollResults id={id} />
        </Container>
      </div>
    </Fragment>
  )
}

export default Results