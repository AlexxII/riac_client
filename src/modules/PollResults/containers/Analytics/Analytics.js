import React, { Fragment, useCallback, useEffect, useState } from 'react'
import uuid from "uuid";
import sample from 'alias-sampling'
import walker from 'walker-sample'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import Tooltip from '@material-ui/core/Tooltip';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Checkbox from '@material-ui/core/Checkbox';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import errorHandler from '../../../../lib/errorHandler'

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

  const [getSameQuestions, { loading: ll, data: dd }] = useLazyQuery(GET_QUESTIONS_WITH_SAME_TOPICS, {
    onError: ({ graphQLErrors }) => {
      setNoti(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
      setProcessing(false)
    }
  });

  useEffect(() => {
    if (dd && !ll) {
      const questions = dd.sameQuestions
      const mainTitle = pollData.poll.questions[resultCount - 1].title
      const upQuestions = sortQuestionsBySimilarity(questions, mainTitle)
      setPrevSimQuestions(upQuestions)
      setSimQuestions(upQuestions)
      setProcessing(false)
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
    setProcessing(true)
    if (previousTopicId && previousTopicId === topicId) {
      const mainText = pollData.poll.questions[resultCount - 1].title
      if (prevSimQuestions) {
        const sortedQuestions = sortQuestionsBySimilarity(prevSimQuestions, mainText)
        setSimQuestions(sortedQuestions)
      }
      setProcessing(false)
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
              <List dense={true} className="analitics-main-question">
                <ListItem>
                  <ListItemText
                    primary={
                      <Fragment>
                        <strong onClick={() => console.log(pollData.poll.questions[resultCount - 1])}>Вопрос: </strong>
                        {pollData.poll.questions[resultCount - 1].title}
                      </Fragment>
                    }
                    secondary={
                      <Fragment>
                        <strong>Тема: </strong>
                        {`ID: ${pollData.poll.questions[resultCount - 1].topic.id} - ${pollData.poll.questions[resultCount - 1].topic.title}`}
                      </Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Запросить аналоги из БД">
                      <IconButton edge="end" onClick={() => handleClick(pollData.poll.questions[resultCount - 1].topic.id)}>
                        <AccountTreeIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>

                </ListItem>
              </List>
              <p>
                <List dense={true} className="analitics-sim-question">
                  {simQuestions &&
                    simQuestions.map((question) => (
                      <Fragment>
                        <ListItem>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={true}
                              tabIndex={-1}
                              disableRipple
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Fragment>
                                <strong>Вопрос: </strong>
                                {question.title}
                              </Fragment>
                            }
                            secondary={
                              <Fragment>
                                <strong>Тема: </strong>
                                {`ID: ${question.topic.id} - ${question.topic.title}`}
                                <br></br>
                                <strong>Опрос: </strong>
                                {`${question.poll.code}`}
                              </Fragment>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Просмотреть ответы">
                              <IconButton edge="end" onClick={() => console.log(question)}>
                                <AccountTreeIcon />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>

                        </ListItem>
                        <Divider variant="inset" />
                      </Fragment>
                    ))}
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