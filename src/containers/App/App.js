import React, { Fragment } from 'react';
import './App.scss';
import Router from '../Router'
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';

import { useQuery } from '@apollo/react-hooks';
import SignInWrap from '../SignInWrap'

import { CURRENT_USER_QUERY } from './queries';
import { userVar } from '../../cache'

const App = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY, {
    onCompleted: (data) => userVar(data.currentUser)
  });

  if (loading) return (
    <Fragment>
      <Container component="main" maxWidth="xs">
        <div className="loading-circle">
          <CircularProgress />
          <p>Загрузка. Подождите пожалуйста</p>
        </div>
      </Container>
    </Fragment>
  )

  if (error) return <div>Error: {JSON.stringify(error)}</div>;

  if (!!data.currentUser) {

    return (
      <Fragment>
        <div className="App">
          <Router user={data.currentUser} />
        </div>
      </Fragment>
    );
  }
  return <div>
    <SignInWrap />
  </div>
}

export default App;
