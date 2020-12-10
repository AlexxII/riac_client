import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'
import PollAppSettings from '../modules/PollAppSettings'

const PollAppSettingsPage = () => {
  return (
    <Fragment>
      <SettingBar title={`Настройки подсистемы`} />
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          <PollAppSettings />
        </Container>
      </div>
    </Fragment>
  )
}

export default PollAppSettingsPage