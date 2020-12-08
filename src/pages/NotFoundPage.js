import React, { Fragment } from 'react';
import ErrorState from '../components/ErrorState'


// import { ReactComponent as ErrorIllustration } from "../../illustrations/error.svg";


const NotFoundPage = () => {
  return (
    <Fragment>
      <ErrorState
        title="404 Страница не найдена"
        description="Вы заблудились. Проверьте адрес"
      />
    </Fragment>
  )
}

export default NotFoundPage;