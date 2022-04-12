import React, { Fragment, useState, useEffect } from 'react'

import LoadingState from '../../components/LoadingState'
import SystemNoti from '../../components/SystemNoti'
import ErrorState from '../../components/ErrorState'
import Grid from '@material-ui/core/Grid';
import YearWrap from './components/YearWrap/YearWrap';

import { useQuery } from '@apollo/client'
import { GET_ARCHIVE_POLLS } from './queries'

const PollArchive = () => {
  const [noti, setNoti] = useState(false)

  const {
    loading: pollsLoading,
    error: pollsError,
    data: pollsData
  } = useQuery(GET_ARCHIVE_POLLS)

  if (pollsLoading) return (
    <LoadingState />
  )

  if (pollsError) return (
    <ErrorState
      title="Что-то пошло не так"
      description="Не удалось загрузить критические данные. Смотрите консоль"
    />
  );

  return (
    <Fragment>
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="flex-start"
      >
        <YearWrap polls={pollsData} />
      </Grid>
    </Fragment>
  )
}

export default PollArchive
