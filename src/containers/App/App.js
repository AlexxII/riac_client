import React, { Fragment, useState, useReducer } from 'react';

import './App.scss';
import Router from '../Router'

import { SysnotyContext } from './notycontext'

import SignInForm from '../../components/SignInForm'
import ErrorState from '../../components/ErrorState'
import LoadingSate from '../../components/LoadingState'
import LoadingStatus from '../../components/LoadingStatus'

import SystemNoti from '../../components/SystemNoti'

import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { CURRENT_USER_QUERY } from './queries';
import { SIGNIN_MUTATION } from './mutations';

const App = () => {
  const [noti, setNoti] = useState(false)

  const [passwordError, setPasswordError] = useState(null)
  const [userError, setUserError] = useState(null)

  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

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

  if (loading) return <LoadingSate description="Запрос данных пользователя" />

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
      <SysnotyContext.Provider value={[setNoti]}>
        <div className="App">
          <SystemNoti
            open={noti}
            text={noti ? noti.text : ""}
            type={noti ? noti.type : ""}
            close={() => setNoti(false)}
          />
          <Loading />
          <Router />
        </div>
      </SysnotyContext.Provider>
    );
  }
  return <div>
    <Loading />
    <SignInForm onLogin={handleLogin} userError={userError} passwordError={passwordError} />
  </div>
}

export default App;