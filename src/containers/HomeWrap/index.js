import React, { Fragment, useState } from 'react'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress';

import ListOfPolls from '../ListOfPolls'
import AddPollWrap from '../AddPollWrap'

import { useQuery } from '@apollo/client'
import { pollsQuery } from "./queries"

const HomeWrap = (props, client) => {
  const { loading, error, data, refetch } = useQuery(pollsQuery)

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
        <ListOfPolls data={data} />
      </Container>
      <AddPollWrap refetch={refetch} />
    </Fragment>
  )
}

export default HomeWrap