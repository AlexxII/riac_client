import React, { Fragment } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@material-ui/core/Container';

import SettingBar from '../components/SettingBar'

const Results = () => {
  let { id, code } = useParams();

  return (
    <Fragment>
      <SettingBar title={`Результаты ` + code} />
      <Container maxWidth="md">
        <h2>Страница результатов</h2>
        <h4>ID опроса: {id}</h4>
      </Container>
    </Fragment>
  )
}

export default Results