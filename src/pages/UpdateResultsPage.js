import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'

const UpdateResultsPage = () => {
  const { id } = useParams();

  return (
    <Fragment>
      <SettingBar title={'Обновление'} />
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          Обновление
        </Container>
      </div>
    </Fragment>
  )
}

export default UpdateResultsPage