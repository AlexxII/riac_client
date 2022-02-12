import React, { Fragment, useState, useEffect } from 'react'

import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';

import { parseIni, normalizeLogic } from '../../../PollDrive/lib/utils'
import { useQuery } from '@apollo/client'

import { GET_POLL_DATA } from "./queries"

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const Generation = ({ id }) => {
  const [poll, setPoll] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [logic, setLogic] = useState(null)
  const [count, setCount] = useState(null)
  const { loading, data } = useQuery(GET_POLL_DATA, {
    fetchPolicy: "no-cache",
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
    fetch(url + filePath)
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
      let visibleQuestions = []
      if (logic.invisible) {
        const invisiblePool = logic.invisible
        visibleQuestions = data.poll.questions.filter((question) => {
          const answers = question.answers
          const lAnswers = answers.length
          let count = 0
          for (let i = 0; i < lAnswers; i++) {
            if (invisiblePool.includes(answers[i].code)) {
              count++
            }
          }
          if (count !== lAnswers) {
            return true
          }
        })
      } else {
        visibleQuestions = data.poll.questions
      }
      const modQuestions = visibleQuestions.map((question, index) => {
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

  const testPoolChange = (e) => {
    const val = e.currentTarget.value
    if (val < 0) {
      return
    }
    setCount(val)
  }

  const generateTestPool = () => {
    const worksheetsCount = count
    console.log(questions);
    // freeAnswer
    // freeAnswersPool
    // unique
    // criticalExclude
    // difficult
    for (let i = 0; i < worksheetsCount; i++) {
      questions.map((question, index) => {

      })
    }
  }

  return (
    <Fragment>
      <Grid container>
        <Box>
          <h3>{poll.title}</h3>
        </Box>
        <Grid xs={12} item container justify="flex-start">
          <Box>
            <TextField
              id="outlined-number"
              label="Number"
              type="number"
              value={count}
              onChange={testPoolChange}
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
            />
          </Box>
          <Box p={1}>
            <Button variant="contained" color="primary" disabled={count ? false : true} onClick={generateTestPool}>
              Генерировать
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Fragment>
  )
}
export default Generation