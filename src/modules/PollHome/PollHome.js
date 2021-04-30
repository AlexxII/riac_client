import React, { Fragment, useEffect, useState } from 'react'
import Container from '@material-ui/core/Container'

import PollCard from './components/PollCard'
import AddPollLogic from './components/AddPollLogic'

import LoadingState from '../../components/LoadingState'
import LoadingStatus from '../../components/LoadingStatus'
import SystemNoti from '../../components/SystemNoti'
import ErrorState from '../../components/ErrorState'

import errorHandler from '../../lib/errorHandler'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_ACTIVE_POLLS } from "./queries"
import { ADD_NEW_POLL } from './mutations'

const PollHome = () => {
  const [noti, setNoti] = useState(false)

  const {
    loading: pollsLoading,
    error: pollsError,
    data: pollsData
  } = useQuery(GET_ALL_ACTIVE_POLLS)

  const [addPoll, {
    loading: addLoading
  }] = useMutation(ADD_NEW_POLL, {
    onError: ({ graphQLErrors }) => {
      setNoti(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    },
    update: (cache, { data }) => {
      const { polls } = cache.readQuery({ query: GET_ALL_ACTIVE_POLLS })
      cache.writeQuery({ query: GET_ALL_ACTIVE_POLLS, data: { polls: [...polls, data.addPoll] } })
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
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
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