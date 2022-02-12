import React, { Fragment } from 'react'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'

import { useQuery } from '@apollo/client'

import { GET_POLL_RESULTS_BY_USERS } from './queries'

const Quota = ({ id }) => {

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS_BY_USERS, {
    fetchPolicy: "no-cache",
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
      <div className="liner-service-zone">
        <Typography variant="h5" gutterBottom className="header">Квота</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Количественное распределение респондентов, опрошенных и внесенных в информационную систему сотрудниками.
        </Typography>
      </div>
      <Grid item container className="linear-distribution">

      </Grid>

    </Fragment>
  )
}

export default Quota