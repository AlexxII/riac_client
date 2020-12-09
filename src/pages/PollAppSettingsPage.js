import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'
import PollAppSettings from '../modules/PollAppSettings'

const PollAppSettingsPage = () => {
  return (
    <Fragment>
      <SettingBar title={`Настройки подсистемы`} />
      <div style={{ paddingTop: '10px' }}>
        <PollAppSettings />
      </div>
    </Fragment>
  )
}

export default PollAppSettingsPage