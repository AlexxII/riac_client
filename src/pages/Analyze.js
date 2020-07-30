import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container'

import SettingBar from '../components/SettingBar'
// import XmlAnalyzer from '../components/XmlAnalyzer'

const Analyze = () => {
  let { id } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Анализ XML`} />
      <Container maxWidth="md">
        <h2>Анализ XML</h2>
        {/* <XmlAnalyzer /> */}
      </Container>
    </Fragment>
  )
}

export default Analyze