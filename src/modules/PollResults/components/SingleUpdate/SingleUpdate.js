import React, { Fragment, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Skeleton from '@material-ui/lab/Skeleton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import QuestionCard from '../QuestionCard'

const SingleUpdate = ({ data, respondent, logic, open, close, edit }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [questions, setQuestions] = useState(false)
  const [userSettings, setUserSettings] = useState({
    codesShow: true
  })

  useEffect(() => {
    if (respondent) {
      const questionsEx = questionsFormation(data, respondent, logic)
      setQuestions(questionsEx)
    }
  }, [respondent])

  if (!open) {
    return null
  }
  const poolOfResultsCodes = respondent.result.map(result => result.code)

  const questionsFormation = (data, poolOfResultsCodes, logic) => {
    const questionsEx = data.poll.questions.map(question => {
      let questionSuffix = {
        selectedAnswer: '',
        skip: false
      }
      let selectedIn = false
      let uniqueIn = false
      let uniqueSelected = false
      const answersEx = question.answers.map(answer => {
        const results = answer.results
        let answerSuffix = {
          selected: false,
          resultId: '',
          text: '',
          freeAnswer: false,
          disabled: false,
          skip: false,
          focus: false,
          exclude: [],
          excludeM: ''
        }
        // убираем невидимые вопросы
        if (logic.invisible && logic.invisible.includes(answer.code)) {
          answerSuffix = {
            ...answerSuffix,
            skip: true
          }
        }

        const exclude = logic.criticalExclude ? logic.criticalExclude : false
        if (exclude) {
          // заполняем поле exclude, в котором указаны все коды, которые будут исключены при выборе данного ответа
          for (let code in exclude) {
            if (code === answer.code) {
              answerSuffix = {
                ...answerSuffix,
                exclude: [...answerSuffix.exclude, ...exclude[code]]
              }
            }
            if (exclude[code].includes(answer.code)) {
              answerSuffix = {
                ...answerSuffix,
                exclude: [...answerSuffix.exclude, code]
              }
            }
          }
          // проверяем не исключен ли данный ответ кодами, которые указаны в поле exclude

          const lExclude = answerSuffix.exclude.length
          for (let j = 0; j < lExclude; j++) {
            const code = answerSuffix.exclude[j]
            if (poolOfResultsCodes.includes(code)) {
              answerSuffix = {
                ...answerSuffix,
                disabled: true,
                excludeM: `противоречит коду ${code}`
              }
            }
          }
        }

        if (results.length) {
          const lResults = results.length
          for (let i = 0; i < lResults; i++) {
            if (poolOfResultsCodes.includes(results[i].code)) {
              answerSuffix = {
                ...answerSuffix,
                selected: true,
                resultId: results[i].id,
                text: results[i].text
              }
              questionSuffix = {
                ...questionSuffix,
                selectedAnswer: answer.id
              }
              selectedIn = true
              break
            }
          }
        } else {
          answerSuffix = {
            ...answerSuffix,
            selected: false
          }
        }
        // проверка на блокировку ответа (ВНЕШНЯЯ ЛОГИКА - уникальность)
        if (logic.unique.includes(answer.code)) {
          uniqueIn = true
          answerSuffix = {
            ...answerSuffix,
            unique: true
          }
        }
        if (logic.unique.includes(answer.code) & poolOfResultsCodes.includes(answer.code)) uniqueSelected = true

        //проверка на свободные ответы
        if (logic.freeAnswers && logic.freeAnswers.includes(answer.code)) {
          answerSuffix = {
            ...answerSuffix,
            freeAnswer: true
          }
        }
        return {
          id: answer.id,
          title: answer.title,
          code: answer.code,
          order: answer.order,
          ...answerSuffix
        }
      })
      // если все пропущены, то пропускаем ответ
      const disabledCount = answersEx.reduce((acum, item) => {
        return acum += item.skip ? 1 : 0
      }, 0)
      if (disabledCount === answersEx.length) {
        questionSuffix = {
          ...questionSuffix,
          skip: true
        }
      }
      // проверка на уникальность и исключаемость
      const newAnswers = answersEx.map(answer => {
        if (selectedIn) {
          if (uniqueIn) {
            if (uniqueSelected) {
              return answer.unique & answer.selected ? answer : { ...answer, disabled: true }
            } else {
              return answer.unique ? { ...answer, disabled: true } : answer
            }
          }
        }
        return answer
      })
      return {
        ...question,
        ...questionSuffix,
        answers: newAnswers
      }
    })
    return questionsEx
  }

  const updateState = (newQuestion, answerCode, type) => {
    let newQuestions = []
    switch (type) {
      case 'setCheckbox':
        // если выбранный код является уникальным
        if (logic.unique && logic.unique.includes(answerCode)) {
          newQuestions = questions.map(question => (
            question.id === newQuestion.id
              ?
              {
                ...question,
                answers: newQuestion.answers.map(answer =>
                  answer.code === answerCode
                    ?
                    answer
                    :
                    { ...answer, disabled: true }
                )
              }
              :
              question
          ))
          break
        }
        break
      case 'unsetCheckbox':
        newQuestions = questions.map(question => (
          question.id === newQuestion.id ?
            newQuestion : question
        ))
        break
      case 'setRadio':
        if (logic.unique && logic.unique.includes(answerCode)) {

        }
        break
      default:
        newQuestions = questions.map(question => (
          question.id === newQuestion.id ?
            newQuestion : question
        ))
    }
    setQuestions(newQuestions)
  }

  const codesShow = (e) => {
    setUserSettings(prevState => ({
      ...prevState,
      codesShow: !prevState.codesShow
    }))
  }

  const saveEditResult = () => {

  }

  const onClose = () => {
    setQuestions(false)
    close()
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={"md"}
      open={open}
      onClose={close}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Обновить результаты
      </DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox color="primary" defaultChecked={userSettings.codesShow} />
          }
          onChange={codesShow}
          label="Коды ответов"
          labelPlacement="end"
        />
        <DialogContentText>
          {!questions ?
            (
              <Fragment>
                <Box pt={3}>
                  <Skeleton animation="wave" height={50} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <br />
                </Box>
                <Box pt={3}>
                  <Skeleton animation="wave" height={50} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <br />
                </Box>
              </Fragment>
            )
            :
            questions.map((question, index) => (
              <QuestionCard settings={userSettings} index={index} key={question.id} question={question} updateState={updateState} />
            ))
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Отмена
        </Button>
        {edit ?
          <Button onClick={saveEditResult} color="primary" autoFocus>
            Сохранить
        </Button>
          :
          null
        }
      </DialogActions>
    </Dialog>
  );
}

export default SingleUpdate