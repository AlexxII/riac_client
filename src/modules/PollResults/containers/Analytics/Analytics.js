import React, { Fragment, useCallback, useEffect, useState, useContext } from 'react'
import uuid from "uuid";
import sample from 'alias-sampling'
import walker from 'walker-sample'

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import LoadingStatus from '../../../../components/LoadingStatus'
import errorHandler from '../../../../lib/errorHandler'
import FilterDialog from './components/FilterDialog'
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';

import FullSearch from './containers/FullSearch'
import QuestionAnalytic from './containers/QuestionAnalytic'
import { SysnotyContext } from '../../../../containers/App/notycontext'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { similarity } from '../../../PollResults/lib/utils'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_POLL_DATA, GET_QUESTIONS_WITH_SAME_TOPICS } from './queries.js'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const KEY_TYPE = 'keyup'

const Analytics = ({ id }) => {
  const [setNoti] = useState(SysnotyContext)

  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [filter, setFilter] = useState([])                                             // фильтрация по кодам опросов
  const [filterOptions, setFilterOptions] = useState(false)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const [searchDialogOpen, setSearchDialogOpen] = useState(false)

  const [initState, setInitState] = useState(false)
  const [resultCount, setResultCount] = useState(1)
  const [emptyMessage, setEmptyMessage] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [allSimilar, setAllSimilar] = useState(false)

  useEffect(() => {
    window.addEventListener(KEY_TYPE, keyUpHandler)
    return () => {
      window.removeEventListener(KEY_TYPE, keyUpHandler)
    };
  })

  const {
    data: pollData,
    loading: pollDataLoading,
    error: pollDataError
  } = useQuery(GET_POLL_DATA, {
    fetchPolicy: "no-cache",
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
      // получение уникальных опросов
      const uniqPollsPool = sameQuestionsData.sameQuestions.reduce((acum, item) => {
        if (acum.trash.indexOf(item.poll.code) === -1) {
          acum.trash.push(item.poll.code)
          acum.polls.push(item.poll)
        }
        return acum
      }, {
        trash: [],
        polls: []
      }).polls.map(item => ({ value: item.code, title: item.title, date: item.dateOrder }))
        .sort((a, b) => (a.date > b.date ? 1 : -1))
      setFilterOptions(uniqPollsPool)

      const uQuestions = pollData.poll.questions.map(question => {
        const answers = question.answers.map(answer => (
          {
            ...answer,
            distribution: {
              '1': answer?.distribution[1] ?? null,
              '0': answer?.distribution[0] ?? null,
              '2': answer?.distribution[2] ?? null,
              '3': answer?.distribution[3] ?? null,
              '4': answer?.distribution[4] ?? null,
              '5': answer?.distribution[5] ?? null,
            }
          }
        ))
        if (topicToQuestions[question?.topic?.id]) {
          const similarQuestions = topicToQuestions[question.topic.id]
          return {
            ...question,
            answers,
            saved: false,                                                                     // сохранено ли распределение
            similar: sortQuestionsBySimilarity(similarQuestions, question.title)
          }
        } else {
          return {
            ...question,
            answers,
            saved: false,
            similar: null
          }
        }
      })
      setQuestions(uQuestions)
      setInitState(uQuestions)
      // отобразим первый вопрос
      const currentQuestion = uQuestions[resultCount - 1]
      checkNotEmpty(currentQuestion)
      setProcessing(false)
    }
  }, [sameQuestionsData, sameQuestionsLoading])

  useEffect(() => {
    if (resultCount && questions) {
      const currentQuestion = questions[resultCount - 1]
      checkNotEmpty(currentQuestion)
    }
  }, [resultCount])

  const keyUpHandler = ({ keyCode }) => {
    switch (keyCode) {
      case 39:
        if (resultCount >= questions.length) {
          return
        }
        setResultCount(resultCount + 1)
        break
      case 37:
        if (resultCount <= 1) {
          return
        }
        setResultCount(resultCount - 1)
        break
      default:
        return
    }
  }

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
    if (processing || !filterOptions) return <LoadingStatus />
    return null
  }

  // переключатель между вопросами
  const handleResultChange = (_, value) => {
    setResultCount(value)
    setAllSimilar(false)
  }

  const saveFilterChanges = (filters) => {
    setProcessing(true)
    setFilter(filters)
    setFilterDialogOpen(false)
    if (filters.length) {
      setQuestions(
        initState.map(question => ({
          ...question,
          similar: question.similar ? question.similar.filter(item => filters.includes(item.poll.code)) : null
        }))
      )
    } else {
      // восстанавливаем все вопросы снимая тем самым фильтрацию
      setQuestions(initState)
    }
    setProcessing(false)
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
            <FilterDialog
              open={filterDialogOpen}
              options={filterOptions}
              onClose={() => setFilterDialogOpen(false)}
              mainFilter={filter}
              saveChanges={saveFilterChanges}
            />
            {/*
            <FullSearch
              open={searchDialogOpen}
              options={filterOptions}
              onClose={() => setSearchDialogOpen(false)}
              mainFilter={pollData.questions}
              saveChanges={() => { }}
              question={questions[resultCount - 1]}
            />
            */}
            <div className="pagination-wrap">
              <Badge
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                color="primary"
                badgeContent={filter.length}
              >
                <Tooltip title="Фильтрация">
                  <IconButton aria-label="filter" onClick={() => setFilterDialogOpen(true)} >
                    <FilterListIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Badge>
              <span className="pagination-wrap-title">
                <strong>Вопросы:</strong>
              </span>
              <Pagination
                className="pagination-bar"
                count={pollData.poll.questions.length}
                page={resultCount}
                variant="outlined"
                color="primary"
                shape="rounded"
                onChange={handleResultChange}
                boundaryCount={10}
                renderItem={(item) => (
                  <PaginationItem {...item}
                    className={
                      item.type === 'page' &&
                        questions[item.page - 1].saved ? 'pagination-item-saved' : null
                    }
                  />
                )}
              />
              {/*
              <Tooltip title="Сплошной поиск">
                <IconButton aria-label="filter" onClick={() => setSearchDialogOpen(true)} >
                  <SearchIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              */}
            </div>
            <div className="analitics-main-content">
              <QuestionAnalytic
                poll={id}
                setAllSimilar={setAllSimilar}
                allSimilar={allSimilar}
                question={questions[resultCount - 1]}
                setQuestions={setQuestions}
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