import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'
import PollSettings from '../modules/PollSettings'

const Settings = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Настройки опроса ` + code} />
      <div style={{ paddingTop: '10px' }}>
        <Container maxWidth="xl">
          <PollSettings id={id} code={code} />
        </Container>
      </div>
    </Fragment>
  )
}

export default Settings