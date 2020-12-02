import React, { Fragment } from 'react';

import './App.scss';
import Router from '../Router'
import SignInWrap from '../SignInWrap'
import ErrorState from '../../components/ErrorState'
import LoadingSate from '../../components/LoadingState'

import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from './queries';

// import { ReactComponent as ErrorIllustration } from "../../illustrations/error.svg";

const App = () => {
  const { loading, error, data } = useQuery(CURRENT_USER_QUERY);

  if (loading) return (
    <Fragment>
      <LoadingSate />
    </Fragment>
  )

  if (error) {
    console.log(JSON.stringify(error));
    return (
      <ErrorState
        title="Что-пошло не так"
        description="Приложение не хочет стартовать, смотрите консоль!"
      />
    )
  };

  if (!!data.currentUser) {
    return (
      <Fragment>
        <div className="App">
          <Router />
        </div>
      </Fragment>
    );
  }
  return <div>
    <SignInWrap />
  </div>
}

export default App;