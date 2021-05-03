import React, { Fragment, useCallback, useEffect, useState } from 'react'
import uuid from "uuid";
import sample from 'alias-sampling'
import walker from 'walker-sample'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import SaveIcon from '@material-ui/icons/Save';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'
import Alert from '../../../../components/Alert'
import ListItemEx from './components/ListItemEx/ListItemEx'
import Accordion from './components/Accordition'
import errorHandler from '../../../../lib/errorHandler'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { similarity } from '../../../PollResults/lib/utils'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_POLL_DATA, GET_QUESTIONS_WITH_SAME_TOPICS } from './queries.js'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const MAX_VIEW = 5

const Analytics = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [batchOpen, setBatchOpen] = useState(false)

  const [resultCount, setResultCount] = useState(1)
  const [emptyMessage, setEmptyMessage] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [allSimilar, setAllSimilar] = useState(false)
  const [topicsToQuestionsPool, setTopicsToQuestionsPool] = useState(null)
  const [previousTopicId, setPreviousTopicId] = useState(null)
  const [prevSimQuestions, setPrevSimQuestions] = useState(null)
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
      setTopicsToQuestionsPool(topicToQuestions)
      const uQuestions = pollData.poll.questions.map(question => {
        if (topicToQuestions[question?.topic?.id]) {
          const similatQuestions = topicToQuestions[question.topic.id]
          return {
            ...question,
            similar: sortQuestionsBySimilarity(similatQuestions, question.title)
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

  const EmptyState = () => {
    if (emptyMessage) {
      const message = 'В базе данных отсутствуют вопросы с аналогичной категорией'
      return <Alert text={message} />
    } else {
      return null
    }
  }

  const handleSaveClick = () => {
    const currentQuestion = questions[resultCount - 1]
    console.log(currentQuestion);
  }


  // переключатель между вопросами
  const handleResultChange = (_, value) => {
    setResultCount(value)
    setAllSimilar(false)
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
          Позволяет анализировать и задавать частотное распределение ответов на основе банка опросов.
        </Typography>
      </div>
      <br></br>
      <Grid>
        {pollData &&
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
              <Accordion question={pollData.poll.questions[resultCount - 1]} />
              <p>
                <List dense={true} className="analitics-sim-question">
                  {simQuestions &&
                    simQuestions.map((question, index) => {
                      if (index < MAX_VIEW) {
                        return (
                          <ListItemEx key={index} question={question} select={() => { }} />
                        )
                      }
                    })
                  }
                  <div style={{ "marginTop": "10px" }}>
                    {simQuestions.length > 5
                      ?
                      <Button
                        onClick={() => { setAllSimilar(true) }}
                        variant="outlined">
                        Еще {simQuestions ? ` + ${(simQuestions.length - MAX_VIEW)}` : null}
                      </Button>
                      :
                      <EmptyState />
                    }
                  </div>
                  {simQuestions && allSimilar &&
                    simQuestions.map((question, index) => {
                      if (index >= MAX_VIEW) {
                        return (
                          <ListItemEx key={index} question={question} select={() => { }} />
                        )
                      }
                    })
                  }
                </List>
              </p>
            </div>
          </Fragment>
        }
      </Grid>
    </Fragment>
  )
}

export default Analytics