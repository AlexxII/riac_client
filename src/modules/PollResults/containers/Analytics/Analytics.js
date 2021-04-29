import React, { Fragment, useCallback, useEffect, useState } from 'react'
import uuid from "uuid";
import sample from 'alias-sampling'
import walker from 'walker-sample'

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { similarity } from '../../../PollResults/lib/utils'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_POLL_DATA, GET_QUESTIONS_WITH_SAME_TOPICS } from './queries.js'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const Analytics = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [dataPool, setDataPool] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [displayData, setDisplayData] = useState(false)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [activeWorksheets, setActiveWorksheets] = useState([])                          // отображаемые анкеты
  const [batchOpen, setBatchOpen] = useState(false)
  const [test, setTest] = useState(false)

  const [simQuestions, setSimQuestions] = useState(null)

  const [getSameQuestions, { loading: ll, data: dd }] = useLazyQuery(GET_QUESTIONS_WITH_SAME_TOPICS);

  useEffect(() => {
    if (dd && !ll) {
      const questions = dd.sameQuestions
      const mainTitle = pollData.poll.questions[33].title
      const upQuestions = questions.map(question => (
        {
          ...question,
          p: similarity(mainTitle, question.title)
        }
      )).slice().sort((a, b) => (a.p < b.p) ? 1 : -1)
      setSimQuestions(upQuestions)
      console.log(upQuestions);
    }
  }, [dd, ll])

  const {
    data: pollData,
    loading: pollDataLoading,
    error: pollDataError
  } = useQuery(GET_POLL_DATA, {
    variables: {
      id
    },
    onCompleted: () => {
      handleConfigFile(pollData.poll.logic.path)
    }
  });

  const handleConfigFile = (filePath) => {
    fetch(url + filePath)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const normLogic = normalizeLogic(logic)
        setLogic(normLogic)
      })
  }

  if (pollDataLoading) return (
    <LoadingState type="card" />
  )

  if (pollDataError) {
    console.log(JSON.stringify(pollDataError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (processing) return <LoadingStatus />
    return null
  }

  const handleClick = (topicId) => {
    getSameQuestions({
      variables: {
        id: topicId,
        poll: id
      }
    })
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
      <Grid>
        {pollData &&
          <Fragment>
            <p>
              {pollData.poll.code}
            </p>
            <p>
              {
                pollData.poll.questions[33].title
              }
            </p>
            <p>{
              pollData.poll.questions[33].topic.title
            }</p>
            <Button onClick={() => handleClick(pollData.poll.questions[33].topic.id)}>Забрать</Button>
            <p>
              {simQuestions &&
                simQuestions.map((question, index) => (
                  <p key={uuid()}>{question.title}  - {question.topic.title} - {question.poll.code}</p>
                ))
              }
            </p>
          </Fragment>
        }
      </Grid>
    </Fragment>
  )
}

export default Analytics