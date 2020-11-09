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
  const { loading, error, data, refetch } = useQuery(GET_ALL_ACTIVE_POLLS)
  // TODO: Надо просто обновить КЭЭЭЭЭЭЭЭЭШ
  const [addPoll, { newPoll }] = useMutation(ADD_NEW_POLL, {
    onCompleted: () => refetch()
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
        <ListOfPolls data={data} />
      </Container>
      <AddPollLogic refetch={refetch} addPoll={addPoll}/>
    </Fragment>
  )
}

export default PollHome