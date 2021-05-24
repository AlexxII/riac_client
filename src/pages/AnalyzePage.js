import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container'

import SettingBar from '../components/SettingBar'
import DataAnalyzer from '../modules/DataAnalyzer'

const Analyze = () => {
  return (
    <Fragment>
      <SettingBar title={`Анализатор данных`} />
      <div style={{ paddingTop: '10px' }}>
        <Container maxWidth="xl">
          <DataAnalyzer />
        </Container>
      </div>
    </Fragment>
  )
}

export default Analyze