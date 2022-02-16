import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'
import Users from '../modules/Users'

const UsersPage = () => {
  return (
    <Fragment>
      <SettingBar title={`Пользователи системы`} />
      <div style={{ paddingTop: '10px' }}>
        <Container maxWidth="lg">
          <Users />
        </Container>
      </div>
    </Fragment>
  )
}

export default UsersPage