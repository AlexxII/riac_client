import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import SettingBar from '../components/SettingBar'
import PollFiles from '../modules/PollFiles'

const Attachment = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Файлы ` + code} />
      <div style={{ paddingTop: '10px' }}>
        <Container maxWidth="xl">
          <PollFiles id={id} />
        </Container>
      </div>
    </Fragment>
  )
}

export default Attachment