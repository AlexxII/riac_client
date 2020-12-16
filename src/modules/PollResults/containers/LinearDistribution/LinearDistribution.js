import React, { Fragment } from 'react'

import Grid from '@material-ui/core/Grid';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'

import BarChart from '../../components/BarChart'
import LinearTable from '../../components/LinearTable'

import { useQuery } from '@apollo/client'

import { GET_POLL_WITH_RESULTS } from './queries'

const LinearDistribution = ({ id }) => {

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_WITH_RESULTS, {
    variables: {
      id
    }
  });

  if (pollResultsLoading) return (
    <LoadingState type="card" />
  )

  if (pollResultsError) {
    console.log(JSON.stringify(pollResultsError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  return (
    <Fragment>
      <p> Линейное распределение ответов</p>
      <Grid item container>
        {pollResults.poll.questions.map((question, index) => (
          <Fragment>
            <Grid xs={12} md={6}>
              <LinearTable index={index} key={question.id} question={question} />
            </Grid>
            <Grid xs={12} md={6}>
              <BarChart question={question} />
            </Grid>
            <p></p>
          </Fragment>
        ))}
      </Grid>

    </Fragment>
  )
}

export default LinearDistribution