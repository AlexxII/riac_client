import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';

import SettingBar from '../components/SettingBar'
// import Test from '../containers/Test'

// const Tester = observer(
const TesterPage = () => {

  return (
    <Fragment>
      <SettingBar title='Тестирование инерфейса' />
      <Container maxWidth="lg">
        {/* <Test /> */}
      </Container>
    </Fragment>
  )
}

export default TesterPage