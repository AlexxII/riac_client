import React, { Fragment, useEffect, useState, useContext } from 'react'
import Container from '@material-ui/core/Container'

import PollCard from './components/PollCard'
import AddPollLogic from './components/AddPollLogic'

import { SysnotyContext } from '../../containers/App/notycontext'

import LoadingState from '../../components/LoadingState'
import LoadingStatus from '../../components/LoadingStatus'
import ErrorState from '../../components/ErrorState'

import errorHandler from '../../lib/errorHandler'

import { useQuery, useMutation } from '@apollo/client'

import { GET_ALL_ACTIVE_POLLS } from "./queries"
import { ADD_NEW_POLL } from './mutations'

const PollHome = () => {
  const [setNoty] = useContext(SysnotyContext);

  const {
    loading: pollsLoading,
    error: pollsError,
    data: pollsData
  } = useQuery(GET_ALL_ACTIVE_POLLS)

  const [addPoll, {
    loading: addLoading
  }] = useMutation(ADD_NEW_POLL, {
    onError: ({ graphQLErrors }) => {
      setNoty(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    },
    update: (cache, { data }) => {
      if (data.addPoll) {
        const { polls } = cache.readQuery({ query: GET_ALL_ACTIVE_POLLS })
        cache.writeQuery({ query: GET_ALL_ACTIVE_POLLS, data: { polls: [...polls, data.addPoll] } })
        setNoty({
          type: 'success',
          text: 'Опрос успешно добавлен'
        })
      }
    }
  })

  if (pollsLoading) return (
    <LoadingState />
  )

  if (pollsError) return (
    <ErrorState
      title="Что-то пошло не так"
      description="Не удалось загрузить критические данные. Смотрите консоль"
    />
  );

  const Loading = () => {
    if (addLoading)
      return <LoadingStatus />
    return null
  }

  return (
    <Fragment>
      <Loading />
      <Container maxWidth="md">
        {pollsData.polls
          .map((poll, i) => (
            <PollCard key={i} data={poll} />
          ))}
      </Container>
      <AddPollLogic addPoll={addPoll} />
    </Fragment>
  )
}

export default PollHome