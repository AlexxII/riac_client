import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';
import { observer } from 'mobx-react'

import SettingBar from '../components/SettingBar'
import Test from '../containers/Test'

// const Tester = observer(
const Tester = () => {

  return (
    <Fragment>
      <SettingBar title='Тестирование инерфейса' />
      <Container maxWidth="lg">
        <Test />
      </Container>
    </Fragment>
  )
}

export default Tester