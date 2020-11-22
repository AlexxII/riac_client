import React, { Fragment, useState, useEffect } from 'react'
import { mainUrl } from '../../../../mainconfig'

import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress'
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';

import EditIcon from '@material-ui/icons/Edit';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

import { parseIni, normalizeLogic } from '../../../PollDrive/lib/utils'
import { gql, useApolloClient, useQuery } from '@apollo/client'

import { GET_POLL_DATA } from "./queries"
import { GET_ALL_ACTIVE_POLLS } from '../../../PollHome/queries'

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
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Box m={1}>
          <span className="answer-number">{index + 1}.</span>
          <span className="devider"> </span>
          <span className="answer-code">{answer.code}</span>
          <span className="devider"> - </span>
          <span className="answer-title">{answer.title}</span>

        </Box>
        <Box m={1}>
          <span>
            <ServiceIcons answer={answer} />
          </span>
        </Box>
      </Grid>

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
          <span className="question-number">{index + 1}.</span>
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
  const client = useApolloClient()
  const [ready, setReady] = useState(false)
  const [questions, setQuestions] = useState()
  const {
    loading,
    data: pollData
  } = useQuery(GET_POLL_DATA, {
    variables: { id },
    onCompleted: () => {
      handleConfigFileAndUpdateCache(pollData.poll)
    }
  })


  const handleConfigFileAndUpdateCache = (poll) => {
    const filePath = poll.logic.path
    fetch(mainUrl + filePath)
      .then((r) => r.text())
      .then(text => {
        const normalizedLogic = normalizeLogic(parseIni(text))
        const updatedQuestions = modulateQuestionsWithLogic(normalizedLogic)
        setQuestions(updatedQuestions.sort((a, b) => (a.order > b.order) ? 1 : -1))
        setReady(true)
      })
  }

  const modulateQuestionsWithLogic = (logic) => {
    const modQuestions = pollData.poll.questions.map(question => {
      const newAnswers = question.answers.map(answer => {
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
        answers: newAnswers,
        ffffuck: true
      }
      return newQuestion
    })
    return modQuestions
  }

  if (loading || !questions || !ready) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  return (
    <Fragment>
      <Grid container className="common-settings">
        <h3>{pollData.poll.title}</h3>
        <Grid
          className="poll-info"
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Box m={1}>
            <div> Вопросов: {pollData.poll.questionsCount}</div>
          </Box>
          <Box m={1}>
            <div> Ответов: {pollData.poll.answersCount}</div>
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