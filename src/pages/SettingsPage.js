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
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          <PollSettings id={id} code={code} />
        </Container>
      </div>
    </Fragment>
  )
}

export default Settings