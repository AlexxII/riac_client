import React, { Fragment, useCallback, useEffect, useState } from 'react'
import uuid from "uuid";
import sample from 'alias-sampling'
import walker from 'walker-sample'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';

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

  const [resultCount, setResultCount] = useState(1)

  const [previousTopicId, setPreviousTopicId] = useState(null)
  const [prevSimQuestions, setPrevSimQuestions] = useState(null)
  const [simQuestions, setSimQuestions] = useState(false)

  const [getSameQuestions, { loading: ll, data: dd }] = useLazyQuery(GET_QUESTIONS_WITH_SAME_TOPICS);

  useEffect(() => {
    if (dd && !ll) {
      const questions = dd.sameQuestions
      const mainTitle = pollData.poll.questions[resultCount - 1].title
      const upQuestions = sortQuestionsBySimilarity(questions, mainTitle)
      setPrevSimQuestions(upQuestions)
      setSimQuestions(upQuestions)
      console.log(upQuestions);
    }
  }, [dd, ll])

  const sortQuestionsBySimilarity = (questions, mainTitle) => {
    return questions.map(question => (
      {
        ...question,
        p: similarity(mainTitle, question.title)
      }
    )).slice().sort((a, b) => (a.p < b.p) ? 1 : -1)
  }

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
    if (previousTopicId && previousTopicId === topicId) {
      const mainText = pollData.poll.questions[resultCount - 1].title
      const sortedQuestions = sortQuestionsBySimilarity(prevSimQuestions, mainText)
      setSimQuestions(sortedQuestions)
    } else {
      setPreviousTopicId(topicId)
      getSameQuestions({
        variables: {
          id: topicId,
          poll: id
        }
      })
    }
  }

  const handleResultChange = (e, value) => {
    setResultCount(value)
    setSimQuestions(false)
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
      <div className="category-service-zone">
        <Typography variant="h5" gutterBottom className="header">Аналитический модуль</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Позволяет проанализирвать и задать распределение на основе аналогичных опросов.
        </Typography>
      </div>
      <br></br>
      <Grid>
        {pollData &&
          <Fragment>
            <Pagination
              count={pollData.poll.questions.length}
              page={resultCount}
              variant="outlined"
              color="primary"
              shape="rounded"
              onChange={handleResultChange}
              boundaryCount={10}
            />
            <p>
              {
                pollData.poll.questions[resultCount - 1].title
              }
            </p>
            <p>{
              pollData.poll.questions[resultCount - 1].topic.title
            }</p>
            <Button onClick={() => handleClick(pollData.poll.questions[resultCount].topic.id)}>Забрать</Button>
            <p>
              {simQuestions &&
                simQuestions.map((question) => (
                  <p onClick={() => console.log(question)} key={uuid()}>{question.title}  - {question.topic.title} - {question.poll.code}</p>
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