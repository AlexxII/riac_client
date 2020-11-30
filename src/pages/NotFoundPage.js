import React, { Fragment } from 'react';
import ErrorState from '../components/ErrorState'

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