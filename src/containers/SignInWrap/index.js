import React, { useState, useEffect, Fragment } from 'react'
import { useMutation } from '@apollo/react-hooks';

import SignInForm from '../../components/SignInForm'
import { SIGNIN_MUTATION } from './mutations';
import { CURRENT_USER_QUERY } from '../App/queries'

const SignInWrap = () => {
  const [userError, setUserError] = useState(null)
  const [passwordError, setPasswordError] = useState(null)
  const [user, setUser] = useState(null)
  const [signin, { data, loading, error }] = useMutation(
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

  useEffect(() => {
    if (user) {
      signin({ variables: user })
    }
  }, [user])

  const handleLogin = (data) => {
    setUser(data)
  }

  return (
    <Fragment>
      <SignInForm onLogin={handleLogin} userError={userError} passwordError={passwordError} />
      {/* { mutationLoading && <p>Loading...</p>} */}
      {/* { mutationError && <p>Error :( Please try again</p>} */}
    </Fragment>
  )

}

export default SignInWrap