import React, { Fragment, useCallback, useEffect, useState, useContext } from 'react'
import uuid from "uuid";
import sample from 'alias-sampling'
import walker from 'walker-sample'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Pagination from '@material-ui/lab/Pagination';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import LoadingStatus from '../../../../components/LoadingStatus'
import errorHandler from '../../../../lib/errorHandler'

import QuestionAnalytic from './containers/QuestionAnalytic'

import { SysnotyContext } from '../../../../containers/App/notycontext'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { similarity } from '../../../PollResults/lib/utils'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_POLL_DATA, GET_QUESTIONS_WITH_SAME_TOPICS } from './queries.js'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const Analytics = ({ id }) => {
  const [setNoti] = useState(SysnotyContext)

  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [resultCount, setResultCount] = useState(1)
  const [emptyMessage, setEmptyMessage] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [allSimilar, setAllSimilar] = useState(false)
  const [simQuestions, setSimQuestions] = useState(false)

  const {
    data: pollData,
    loading: pollDataLoading,
    error: pollDataError
  } = useQuery(GET_POLL_DATA, {
    variables: {
      id
    },
    onCompleted: () => {
      setProcessing(true)
      handleConfigFile(pollData.poll.logic.path)
      gettingSimilarQuestions(pollData)
    }
  });

  const [getSameQuestions, { loading: sameQuestionsLoading, data: sameQuestionsData }] = useLazyQuery(GET_QUESTIONS_WITH_SAME_TOPICS, {
    onError: ({ graphQLErrors }) => {
      setNoti(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    }
  });

  const gettingSimilarQuestions = (pollData) => {
    const uniqueTopics = [...new Set(pollData.poll.questions.map(questions => questions.topic.id))]
    getSameQuestions({
      variables: {
        topics: uniqueTopics,
        poll: id
      }
    })
  }

  useEffect(() => {
    if (sameQuestionsData && !sameQuestionsLoading) {
      const topicToQuestions = sameQuestionsData.sameQuestions.reduce((acum, item) => {
        const topicId = item.topic.id
        if (!acum.hasOwnProperty(topicId)) {
          acum[topicId] = []
        }
        acum[topicId].push(item)
        return acum
      }, {})
      const uQuestions = pollData.poll.questions.map(question => {
        if (topicToQuestions[question?.topic?.id]) {
          const similarQuestions = topicToQuestions[question.topic.id]
          return {
            ...question,
            similar: sortQuestionsBySimilarity(similarQuestions, question.title)
          }
        } else {
          return {
            ...question,
            similar: null
          }
        }
      })
      setQuestions(uQuestions)
      // отобразим первый вопрос
      const currentQuestion = uQuestions[resultCount - 1]
      setSimQuestions(currentQuestion.similar ?? [])
      checkNotEmpty(currentQuestion)
      setProcessing(false)
    }
  }, [sameQuestionsData, sameQuestionsLoading])

  useEffect(() => {
    if (resultCount && questions) {
      const currentQuestion = questions[resultCount - 1]
      setSimQuestions(currentQuestion.similar ?? [])
      checkNotEmpty(currentQuestion)
    }
  }, [resultCount])

  const sortQuestionsBySimilarity = (questions, mainTitle) => {
    return questions.map(question => (
      {
        ...question,
        p: similarity(mainTitle, question.title)
      }
    )).slice().sort((a, b) => (a.p < b.p) ? 1 : -1)
  }

  // для отрисовки сообщения, что похожих компонентов нет в БД
  const checkNotEmpty = (currentQuestion) => {
    if (!currentQuestion.similar) {
      setEmptyMessage(true)
    } else {
      setEmptyMessage(false)
    }
  }

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

  // переключатель между вопросами
  const handleResultChange = (_, value) => {
    setResultCount(value)
    setAllSimilar(false)
  }

  return (
    <Fragment>
      <Loading />
      <div className="category-service-zone">
        <Typography variant="h5" gutterBottom className="header">Аналитический модуль</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Позволяет анализировать и задавать частотное распределение ответов на основе банка опросов.
        </Typography>
      </div>
      <br></br>
      <Grid>
        {questions &&
          <Fragment>
            <div className="pagination-wrap">
              <span className="pagination-wrap-title">
                <strong>Вопросы:</strong>
              </span>
              <Pagination
                count={pollData.poll.questions.length}
                page={resultCount}
                variant="outlined"
                color="primary"
                shape="rounded"
                onChange={handleResultChange}
                boundaryCount={10}
              />
            </div>
            <div className="analitics-main-content">
              <QuestionAnalytic
                setAllSimilar={setAllSimilar}
                allSimilar={allSimilar}
                question={questions[resultCount - 1]}
                setQuestions={setQuestions}
                simQuestions={simQuestions}
                emptyMessage={emptyMessage}
              />
            </div>
          </Fragment>
        }
      </Grid>
    </Fragment>
  )
}

export default Analytics