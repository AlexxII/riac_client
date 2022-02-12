import React, { Fragment, useState, useEffect } from 'react'

import Container from '@material-ui/core/Container'
import LoadingState from '../../components/LoadingState'
import LoadingStatus from '../../components/LoadingStatus'
import SystemNoti from '../../components/SystemNoti'
import ErrorState from '../../components/ErrorState'
import Grid from '@material-ui/core/Grid';

import PollCard from '../PollHome/components/PollCard'
import YearsList from './components/YearsList'

import { useQuery } from '@apollo/client'
import { GET_ARCHIVE_POLLS } from './queries'

const PollArchive = () => {
  const [noti, setNoti] = useState(false)
  const [years, setYears] = useState([])

  const {
    loading: pollsLoading,
    error: pollsError,
    data: pollsData
  } = useQuery(
    GET_ARCHIVE_POLLS,
    {
      fetchPolicy: "no-cache"
    }
  )

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
    if (false)
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
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
      >
        <Grid item md={2} xs={12} >
          <p>
            <YearsList polls={pollsData} />
          </p>
        </Grid>
        <Grid item md={6} xs={12}>
          <Container maxWidth="md">
            {pollsData.archivePolls.length ?
              pollsData.archivePolls.map((poll, i) => (
                <PollCard key={i} data={poll} />
              ))
              :
              ''
            }
          </Container>
        </Grid>
      </Grid>
    </Fragment>
  )
}

export default PollArchive
