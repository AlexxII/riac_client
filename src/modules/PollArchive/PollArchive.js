import React, { Fragment, useState } from 'react'

import Container from '@material-ui/core/Container'

import LoadingState from '../../components/LoadingState'
import LoadingStatus from '../../components/LoadingStatus'
import SystemNoti from '../../components/SystemNoti'
import ErrorState from '../../components/ErrorState'

import PollCard from '../PollHome/components/PollCard'

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
      <Container maxWidth="md">
        {pollsData.archivePolls.length ?
          pollsData.archivePolls.map((poll, i) => (
            <PollCard key={i} data={poll} />
          ))
          :
          ''
        }
      </Container>
    </Fragment>
  )
}

export default PollArchive
