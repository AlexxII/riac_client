import React, { Fragment, useState } from 'react';

import './App.scss';
import Router from '../Router'

import SignInForm from '../../components/SignInForm'

import ErrorState from '../../components/ErrorState'
import LoadingSate from '../../components/LoadingState'
import LoadingStatus from '../../components/LoadingStatus'

import { useQuery } from '@apollo/react-hooks';
import { useMutation } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from './queries';
import { SIGNIN_MUTATION } from './mutations';


const App = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);
  const [passwordError, setPasswordError] = useState(null)
  const [userError, setUserError] = useState(null)

  const [signin, { loading: signinLoading }] = useMutation(
    SIGNIN_MUTATION,
    {
      onError: (e) => {
        setUserError('Неправильный логин или пароль')
        setPasswordError(true)
      },
      update: (cache, { data: { signin } }) => cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: signin.user },
      }),
    }
  )

  if (loading) return <LoadingSate />

  if (error) {
    console.log(JSON.stringify(error));
    return (
      <ErrorState
        title="Что-пошло не так"
        description="Приложение не хочет стартовать, смотрите консоль!"
      />
    )
  };

  const handleLogin = (data) => {
    signin({ variables: data })
  }

  const Loading = () => {
    if (signinLoading) return <LoadingStatus />
    return null
  }


  if (!!data.currentUser) {
    return (
      <Fragment>
        <div className="App">
          <Loading />
          <Router />
        </div>
      </Fragment>
    );
  }
  return <div>
    <Loading />
    <SignInForm onLogin={handleLogin} userError={userError} passwordError={passwordError} />
  </div>
}

export default App;