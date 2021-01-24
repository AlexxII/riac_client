import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'

import SdpCheck from '../modules/SdpCheck'

const SdpCheckPage = () => {
  return (
    <Fragment>
      <SettingBar title={`Проверка СДП`} />
      <div>
        <Container maxWidth="xl" style={{ padding: 0 }}>
          <SdpCheck />
        </Container>
      </div>
    </Fragment>
  )
}

export default SdpCheckPage