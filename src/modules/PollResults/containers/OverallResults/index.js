import React, { Fragment, useState } from 'react'

import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import MuiAlert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ConfirmDialog from '../../../../components/ConfirmDialog'
import QuestionCard from '../../components/QuestionCard'
import AnswerCard from '../../components/AnswersCard'
import RespondentCard from '../../components/RespondentCard'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_RESULTS_EX } from './queries'

const OverallResults = ({ id }) => {
  const [selectPool, setSelectPool] = useState([''])
  const [lastSelectedIndex, setLastSelectedIndex] = useState()
  const [delConfirm, setDelConfirm] = useState(false)
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
  } = useQuery(GET_POLL_RESULTS_EX, {
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

  const handleSelect = (data) => {
    // console.log(pollResults);
    setLastSelectedIndex(data.index)

    if (data.event.nativeEvent.ctrlKey) {
      if (selectPool.includes(data.id)) {
        const n = selectPool.filter(id => {
          return id !== data.id
        })
        setSelectPool(n)
        return
      } else {
        setSelectPool(prevState => ([
          ...prevState,
          data.id
        ]))
        return
      }
    }
    if (data.event.nativeEvent.shiftKey) {
      const ar = pollResults.pollResults.slice(lastSelectedIndex, data.index + 1)
      const rr = ar.map(obj => {
        if (!selectPool.includes(obj.id)) {
          return obj.id
        }
      })
    }
    // при простом клике мышью
    if (selectPool.includes(data.id)) {
      if (selectPool.length > 1) {
        setSelectPool([data.id])
        return
      }
      setSelectPool([''])
    } else {
      setSelectPool([data.id])
    }
  }

  return (
    <Fragment>
      <div className="result-service-zone">
        <Typography className="header">Общие результаты опроса</Typography>
        <Button variant="contained" color="primary" size="small">
          Добавить
      </Button>
      </div>
      <ConfirmDialog
        open={delConfirm}
        confirm={handleDialogConfirm}
        close={handleDialogClose}
        data={
          {
            title: 'Удалить населенный пункт?',
            text: 'Внимание! Результаты опросов учитывают н.п. в которых они проводились, удаление приведет к потере части статистики и некорректности ее отображения.'
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