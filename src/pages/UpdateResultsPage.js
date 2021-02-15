import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'

import ResultUpdate from '../modules/PollResults/containers/ResultUpdate'

const UpdateResultsPage = () => {
  const { poll, respondent } = useParams();

  return (
    <Fragment>
      <SettingBar title={'Обновление'} />
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          <ResultUpdate pollId={poll} respondentId={respondent} />
        </Container>
      </div>
    </Fragment>
  )
}

export default UpdateResultsPage