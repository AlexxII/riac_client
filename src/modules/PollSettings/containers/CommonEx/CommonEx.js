import React, { Fragment, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import LoadingStatus from '../../../../components/LoadingStatus'
import ErrorState from '../../../../components/ErrorState'
import LoadingState from '../../../../components/LoadingState'
import SystemNoti from '../../../../components/SystemNoti'

import PollStatus from '../../components/PollStatus'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_DATA } from "./queries"
import { SAVE_POLL_STATUS } from './mutations'

const CommonEx = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const {
    loading,
    error,
    data: pollData
  } = useQuery(GET_POLL_DATA, {
    variables: { id }
  })

  const [saveNewStatus, { loading: saveStatusLoading }] = useMutation(SAVE_POLL_STATUS, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить не удалось. Смотрите консоль.'
      })
    },
    onCompleted: () => {
      setNoti({
        type: 'success',
        text: 'Новый статус сохранен!'
      })
    },
    // refetchQueries: () => [{
    //   query: GET_POLL_DATA,
    //   variables: {
    //     id
    //   }
    // }]
  })

  const changePollStatus = (index) => {
    saveNewStatus({
      variables: {
        id,
        active: Boolean(index)
      }
    })
  }

  const Loading = () => {
    if (saveStatusLoading) return <LoadingStatus />
    return null
  }

  if (loading) return (
    <LoadingState type="card" />
  )

  if (error) {
    console.log(JSON.stringify(error));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
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
      <Grid container className="common-settings">
        <Typography variant="h6" gutterBottom>
          <strong>Тема: </strong>{pollData.poll.title}
        </Typography>
        <Grid
          className="poll-info"
          container
          justify="flex-start"
          direction="column"
          alignItems="flex-start"
        >
          <Box>
            <div> Вопросов: {pollData.poll.questionsCount}</div>
          </Box>
          <Box>
            <div> Ответов: {pollData.poll.answersCount}</div>
          </Box>
        </Grid>
        <PollStatus status={pollData.poll.active ? 1 : 0} changeStatus={changePollStatus} />
      </Grid>
    </Fragment>
  )
}

export default CommonEx