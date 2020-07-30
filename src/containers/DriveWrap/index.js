import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useQuery } from '@apollo/client'

import PollDrive from "../../modules/PollDrive";
import { pollDataQuery } from "./queries"

const DriveWrap = ({ id }) => {
  const { loading, error, data } = useQuery(pollDataQuery, {
    variables: { id }
  })

  if (loading) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error) return <p>Error :(</p>;

  return (
    <Fragment>
      <Container maxWidth="md">
        <h3>{id}</h3>
        <PollDrive poll={data} />
      </Container>
    </Fragment>
  )
}

export default DriveWrap