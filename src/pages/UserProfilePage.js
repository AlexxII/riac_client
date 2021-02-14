import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'

import Container from '@material-ui/core/Container';
import SettingBar from '../components/SettingBar'
import UserProfile from '../modules/UserProfile'

const UserProfilePage = () => {
  const { id } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Профиль`} />
      <div>
        <Container maxWidth="xl" style={{ padding: '10px 0 0 0' }}>
          <UserProfile id={id} />
        </Container>
      </div>
    </Fragment >
  )
}

export default UserProfilePage