import React, { Fragment, useState, useEffect } from 'react'
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';

import EditIcon from '@material-ui/icons/Edit';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { parseIni, normalizeLogic } from '../../../../containers/DriveWrap/lib/utils'
import { useQuery } from '@apollo/client'

import { GET_POLL_DATA } from "./queries"

const ServiceIcons = ({ answer }) => {
  const edit = (
    <Tooltip title="Свободный ответ">
      <EditIcon />
    </Tooltip>
  )
  const difficult = (
    <Tooltip title="Затрудняюсь ответить">
      <EmojiPeopleIcon />
    </Tooltip>
  )
  const unique = (
    <Tooltip title="Уникальный ответ">
      <FlashOnIcon />
    </Tooltip>
  )
  let r = []
  if (answer.difficult) {
    r.push(difficult)
  }
  if (answer.freeAnswer) {
    r.push(edit)
  }
  if (answer.unique) {
    r.push(unique)
  }
  return r
}

const AnswerCard = ({ answer, index }) => {
  return (
    <div className={answer.disabled ? "answer-card invisible" : "answer-card"}>
      <span className="answer-number">{index + 1}.</span>
      <span className="devider"> </span>
      <span className="answer-code">{answer.code}</span>
      <span className="devider"> - </span>
      <span className="answer-title">{answer.title}</span>
      <span className="answer-extend">
        <ServiceIcons answer={answer} />
      </span>
    </div>
  )
}

const QuestionCard = ({ question, index }) => {

  return (
    <Card className="question-card">
      <CardContent>
        <div className="question-header">
          <Tooltip title="Макс. кол-во ответов">
            <span className="question-limit">{question.limit}</span>
          </Tooltip>
          <span className="question-number">{index + 1}. </span>
          <span className="question-title" color="textSecondary" gutterBottom>
            {question.title}
          </span>
        </div>
        {question.answers.map((answer, index) => (
          <AnswerCard key={index} answer={answer} index={index} />
        ))}
      </CardContent>
    </Card>
  )
}

const CommonSetting = ({ id }) => {
  const [poll, setPoll] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [logic, setLogic] = useState(null)
  const { loading, error, data } = useQuery(GET_POLL_DATA, {
    variables: { id },
    onCompleted: () => {
      setPoll({
        id: data.poll.id,
        title: data.poll.title,
        questionsCount: data.poll.questionsCount,
        answersCount: data.poll.answersCount
      })
      handleConfigFile(data.poll.logic.path)
    }
  })

  const handleConfigFile = (filePath) => {
    fetch(`http://localhost:4000${filePath}`)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const mainLogic = normalizeLogic(logic)
        setLogic(mainLogic)
      })
  }

  useEffect(() => {
    if (logic) {
      const modQuestions = data.poll.questions.map((question, index) => {
        const newAnswers = question.answers.map((answer, index) => {
          let suffix = {}
          if (logic.invisible) {
            if (logic.invisible.includes(answer.code)) {
              suffix = {
                ...suffix,
                disabled: true
              }
            }
          }
          if (logic.freeAnswers) {
            if (logic.freeAnswers.includes(answer.code)) {
              suffix = {
                ...suffix,
                freeAnswer: true
              }
            }
          }
          if (logic.unique) {
            if (logic.unique.includes(answer.code)) {
              suffix = {
                ...suffix,
                unique: true
              }
            }
          }
          if (logic.difficult) {
            if (logic.difficult.includes(answer.code)) {
              suffix = {
                ...suffix,
                difficult: true
              }
            }
          }
          const newAnswer = {
            ...answer,
            ...suffix
          }
          return newAnswer
        })
        const newQuestion = {
          ...question,
          answers: newAnswers
        }
        return newQuestion
      })
      setQuestions(modQuestions)
    }
  }, [logic])


  if (loading || !logic || !questions) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  return (
    <Fragment>
      <Grid container>
        <h3>{poll.title}</h3>
        <Grid
          className="poll-info"
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Box m={1}>
            <div> Вопросов: {poll.questionsCount}</div>
          </Box>
          <Box m={1}>
            <div> Ответов: {poll.answersCount}</div>
          </Box>
        </Grid>
        {questions.map((question, index) => (
          <QuestionCard question={question} key={index} index={index} />
        ))}
      </Grid>
    </Fragment>
  )
}
export default CommonSetting