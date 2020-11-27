import React, { Fragment } from 'react'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress';

import ListOfPolls from './components/ListOfPolls'
import AddPollLogic from './components/AddPollLogic'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_ACTIVE_POLLS } from "./queries"
import { ADD_NEW_POLL } from './mutations'

const PollHome = () => {
  const { loading, error, data } = useQuery(GET_ALL_ACTIVE_POLLS)
  const [addPoll] = useMutation(ADD_NEW_POLL, {
    update: (cache, { data }) => {
      const { polls } = cache.readQuery({ query: GET_ALL_ACTIVE_POLLS })
      cache.writeQuery({ query: GET_ALL_ACTIVE_POLLS, data: { polls: [...polls, data.addPoll] } })
    }
  })

  if (loading) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error) return (
    <p>Error :(</p>
  );

  return (
    <Fragment>
      <Container maxWidth="md">
        <ListOfPolls data={data} />
      </Container>
      <AddPollLogic addPoll={addPoll} />
    </Fragment>
  )
}

export default PollHome