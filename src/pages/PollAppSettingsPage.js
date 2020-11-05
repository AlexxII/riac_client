import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'
import PollAppSettings from '../modules/PollAppSettings'

const PollAppSettingsPage = () => {
  return (
    <Fragment>
      <SettingBar title={`Настройки подсистемы`} />
      <div style={{ paddingTop: '10px' }}>
        <Container maxWidth="xl">
          <PollAppSettings />
        </Container>
      </div>
    </Fragment>
  )
}

export default PollAppSettingsPage