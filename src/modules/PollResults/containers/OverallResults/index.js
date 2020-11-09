import React, { Fragment, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';

import ConfirmDialog from '../../../../components/ConfirmDialog'
import QuestionCard from '../../components/QuestionCard'
import AnswerCard from '../../components/AnswersCard'
import RespondentCard from '../../components/RespondentCard'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS } from './queries'

const OverallResults = ({ id }) => {
  const [selectPool, setSelectPool] = useState([])
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_POLL_RESULTS, {
    variables: {
      id
    }
  })

  if (pollResultsLoading || !pollResults) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleDialogConfirm = () => {

  }

  const handleDialogClose = () => {

  }

  const showDetails = (result) => {
    const data = result.result
    const res = data.map(obj => {
      if (obj.text !== '') {
        return obj.code + ' ' + obj.text
      }
      return obj.code
    })
    console.log(res);
  }

  const handleEdit = () => {

  }

  const handleSelect = (id) => {
    setSelectPool(prevState => ([
      ...prevState,
      id
    ]))
    console.log(id);
  }

  return (
    <Fragment>
      <ConfirmDialog
        open={selectPool.length}
        confirm={handleDialogConfirm}
        close={handleDialogClose}
        data={
          {
            title: 'Удалить населенный пункт?',
            text: 'Внимание! Результаты опросов учитывают н.п. в которых они проводились, удаление\
            приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <Grid container spacing={3}>
        {pollResults.pollResults.map((result, index) => (
          <Grid item xs={12} md={2} key={index} >
            <RespondentCard
              result={result}
              index={index}
              show={showDetails}
              edit={handleEdit}
              selected={selectPool.includes(result.id)}
              select={handleSelect}
            />
          </Grid>
        ))}
      </Grid>
    </Fragment>
  )
}


export default OverallResults