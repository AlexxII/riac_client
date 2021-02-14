import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'

import PollDrive from '../modules/PollDrive'

const UpdateResultsPage = () => {
  const { poll, respondent } = useParams();

  return (
    <Fragment>
      <SettingBar title={'Обновление'} />
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          <PollDrive pollId={poll} respondentId={respondent}/>
        </Container>
      </div>
    </Fragment>
  )
}

export default UpdateResultsPage