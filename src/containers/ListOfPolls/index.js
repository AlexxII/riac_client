import React, { Fragment } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useQuery } from '@apollo/client'

import PollCard from '../../components/PollCard'
import { pollsQuery } from "./queries"

const ListOfPolls = () => {
  const { loading, error, data } = useQuery(pollsQuery)

  if (loading) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error) return <p>Error :(</p>;

  return data.pollInfo.map((poll, i) => (
    <PollCard key={i} data={poll} />
  ))
}

export default ListOfPolls