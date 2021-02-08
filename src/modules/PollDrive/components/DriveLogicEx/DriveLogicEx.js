import React, { Fragment, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Prompt } from 'react-router-dom'

import FinishDialog from '../FinishDialog';
import QuestionCard from '../../../PollResults/components/QuestionCard'

import defineSelectedAnswer from '../../lib/defineSelectedAnswer'
import questionFormationEx from '../../lib/questionFormationEx'

import beep from '../../lib/beep'

const KEY_TYPE = 'keyup'
const STEP_DELAY = 0
const MOVE_DELAY = 200

const VALID_CODE = 1
const RESET_RESULTS = 2
const CONFIRM_QUESTION = 3
const SKIP = 4

const TRUE_ANSWER = 1
const MOVE_FORWARD = 2
const MOVE_BACK = 3

const SET_ANSWER = 1
const UNSET_ANSWER = 2
const SET_RADIO_ANSWER = 3

// автоПереход по настройке пользователя !!!!!!!!!!!!!!

const DriveLogicEx = ({ poll, logics, setCurrentQuestion, saveAndGoBack, saveWorksheet }) => {
  const questionsLimit = poll.questions.length
  const [question, setQuestion] = useState(null)
  const [userSettings, setUserSettings] = useState({
    codesShow: true,
    autoStep: true,                    // автоматический переход к другому вопросу
    cityAgain: false                   // повтор вопроса с выбором города!!!!
  })
  const [direction, setDirection] = useState(1)
  const [logic] = useState(logics)
  const [count, setCount] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const [results, setResults] = useState(
    {
      pool: []
    }
  )
  const [finish, setFinish] = useState(false)
  const [userBack, setUserBack] = useState(false)
  const [finishDialog, setFinishDialog] = useState(false)
  const [inlineMessage, setInlineMessage] = useState('')

  useEffect(() => {
    document.addEventListener(KEY_TYPE, keyUpHandler)
    return () => {
      document.removeEventListener(KEY_TYPE, keyUpHandler)
    };
  })

  // Кнопка с треброванием выдать ID и сохранить !!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    // первичная инициализация, наложение логики и сохранение в стор следующего вопроса + восстановление промежуточных итогов
    const nextQuestion = questionFormationEx(poll.questions[count], count, logic, results, setResults);
    if (nextQuestion.skip) {
      if (direction) {
        if (count === questionsLimit - 1) {
          checkRespondentFinish(nextQuestion.results)
          // setEarlyСompletion(true)
          return
        }
        setCount(count + 1)
      } else {
        setCount(count - 1)
      }
      return
    }
    setVisibleCount(count)
    setQuestion(nextQuestion)
  }, [count])

  const keyUpHandler = ({ target, keyCode }) => {
    if (target.nodeName === 'BODY') {
      const nextStep = defineSelectedAnswer(keyCode)
      switch (nextStep.do) {
        case VALID_CODE: {
          const decideStep = whatDoNext(+nextStep.trueCode)
          switch (decideStep) {
            case TRUE_ANSWER: {
              const selectedAnswer = question.answers.filter(answer => answer.keyCode === +nextStep.trueCode)[0]
              const mainAction = checkSetOrUnset(selectedAnswer)
              switch (mainAction) {
                case SET_ANSWER: {
                  setAnswer(selectedAnswer)
                  return
                }
                case UNSET_ANSWER: {
                  unsetAnswer(selectedAnswer)
                  return
                }
                case SET_RADIO_ANSWER: {
                  setRadioAnswer(selectedAnswer)
                  return
                }
                default: {
                  return
                }
              }
              return
            }
            case MOVE_FORWARD: {
              goToNext()
              return
            }
            case MOVE_BACK: {
              goToPrevious()
              return
            }
            default: {
              beep()
              return
            }
          }
        }
        case CONFIRM_QUESTION: {
          confirmResults()
          return
        }
        case RESET_RESULTS: {
          resetAnswers()
          return
        }
        case SKIP: {
          return                                                    // нажата системная клавиша, не относящаяся к опросу
        }
        default: {
          return
        }
      }
    }
    return
  }

  const confirmResults = () => {
    if (finish) {
      finishRespondent()
    } else {
      if (results[question.id] && results[question.id].data.length) {
        goToNext()
        return
      }
      beep()
    }
  }

  const goToNext = () => {
    setDirection(1)
    if (count < questionsLimit - 1) {
      setCount(count + 1)
    } else {
      setCount(0)
    }
  }

  const goToPrevious = () => {
    setDirection(0)
    if (count === 0) {
      setCount(questionsLimit - 1)
    } else {
      setCount(count - 1)
    }
  }

  // функция проверки 
  const whatDoNext = (trueCode) => {
    if (trueCode === 39) {                              // клавиша вправо
      return MOVE_FORWARD
    }
    if (trueCode === 37) {                              // клавиша влево
      return MOVE_BACK
    }
    if (question.keyCodesPool !== undefined && question.keyCodesPool.includes(trueCode)) {
      return TRUE_ANSWER
    }
    return false
  }

  const checkSetOrUnset = (selectedAnswer) => {
    if (question.multiple) {
      if (results.pool.includes(selectedAnswer.code)) {
        return UNSET_ANSWER
      } else {
        return SET_ANSWER
      }
    } else {
      return SET_RADIO_ANSWER
    }
  }

  // выбран новый ответ на вопрос
  const setAnswer = (selectedAnswer) => {
    // если ответ не активен -> выбрать не можем
    if (selectedAnswer.disabled) return
    // проверка на уникальность ответа и выбраннного до этого противоречивого ответа (ВНЕШНЯЯ ЛОГИКА - уникальность)
    if (logic.unique.includes(selectedAnswer.code)) {
      if (results[question.id].data.length) {
        beep()
        return
      }
    }

    if (selectedAnswer.freeAnswer) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.keyCode === selectedAnswer.keyCode ? { ...answer, selected: true, focus: true } : answer
        )
      }))
      return
    }

    // проверка на активность ответа и ограничение по количеству ответов
    const newResults = storeSelectedResult(selectedAnswer)

    if (newResults[question.id].data.length >= question.limit) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.selected ? answer : { ...answer, disabled: true }
        )
      }))
      return
    }
  }

  const setRadioAnswer = (selectedAnswer) => {
    // проверить если выбран уже сохраненный ответ
    if (results.pool.includes(selectedAnswer.code)) return
    canclePreviousResult(selectedAnswer)
    storeSelectedResult(selectedAnswer)

    if (selectedAnswer.freeAnswer) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.keyCode === selectedAnswer.keyCode ? { ...answer, selected: true, focus: true } : answer
        )
      }))
      return
    }

    // автопереход -> зависит от настроек пользователя
    if (userSettings.autoStep) {
      setTimeout(() => {
        goToNext()
      }, MOVE_DELAY)
    }
  }

  // снят ответ на вопрос
  const unsetAnswer = (selectedAnswer) => {
    const newResults = canclePreviousResult(selectedAnswer)
  }


  const checkRespondentFinish = () => {

  }

  const resetAnswers = () => {

  }

  /// ПОКА НЕ ЗНАЮ!!!!!!!!!!!!1
  const updateState = (selectedAnswer, currentQuestion, mode) => {
    switch (mode) {
      case 'set': {
        setAnswer(selectedAnswer)
        break
      }
      case 'unset': {
        unsetAnswer(selectedAnswer)
        break
      }
      case 'radio': {
        setRadioAnswer(selectedAnswer)
        break
      }
      default: {
        return
      }
    }
  }

  // функция сохранения выбранного ответа
  const storeSelectedResult = (selectedAnswer) => {
    const result = {
      answerCode: selectedAnswer.code,
      answerId: selectedAnswer.id,
      freeAnswer: false,
      freeAnswerText: ''
    }
    // проверка на исключаемость (ВНЕШНЯЯ ЛОГИКА - КРИТИЧНАЯ исключаемость) -> запретить ответы, которые указаны в конфиг файле
    for (let code in logic.criticalExclude) {
      // если в выбранных ответах присутствует код, который исключает другие ответы
      if (results.pool.includes(code)) {
        if (logic.criticalExclude[code].includes(selectedAnswer.code)) {
          beep()
          return
        }
      }
    }
    // проверка на исключаемость (ВНЕШНЯЯ ЛОГИКА - НЕКРИТИЧНАЯ исключаемость) -> ОПОВЕСТИТЬ при ответе, которые указаны в конфиг файле
    for (let code in logic.nonCriticalExclude) {
      // если в выбранных ответах присутствует код, который исключает другие ответы
      if (results.pool.includes(code)) {
        if (logic.nonCriticalExclude[code].includes(selectedAnswer.code)) {
          console.log('Ответ не совсем корректен');
        }
      }
    }
    let newResultState = Object.assign({}, results);
    newResultState[question.id].data.push(result)
    newResultState.pool.push(selectedAnswer.code)
    setResults(newResultState)
    setQuestion(prevState => ({
      ...prevState,
      selectedAnswer: selectedAnswer.id,
      answers: prevState.answers.map(
        answer => answer.id === selectedAnswer.id ? { ...answer, selected: true } : answer
      ).map(
        answer => logic.unique.includes(answer.code) & answer.id !== selectedAnswer.id ? { ...answer, disabled: true } : answer
      ).map(
        answer => selectedAnswer.exclude.includes(answer.code) ? {
          ...answer,
          disabled: true,
          excludeM: `противоречит коду ${selectedAnswer.code}`
        } : answer
      )
    }))
    // проверить на уникальность (ВНЕШНЯЯ ЛОГИКА - уникальность) -> запретить другие ответы
    if (logic.unique.includes(selectedAnswer.code)) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.id === selectedAnswer.id ? answer : { ...answer, disabled: true }
        )
      }))
    }
    return newResultState
  }

  const canclePreviousResult = (selectedAnswer) => {
    let newResults = {}
    for (let key in results) {
      if (key === question.id) {
        newResults = {
          ...newResults,
          [question.id]: {
            ...results[question.id],
            data: results[question.id].data.filter(el => el.answerCode !== selectedAnswer.code)
          }
        }
      } else {
        if (key !== 'pool') {
          newResults = {
            ...newResults,
            [key]: results[key]
          }
        } else {
          newResults = {
            ...newResults,
            pool: results.pool.filter(el => el !== selectedAnswer.code)
          }
        }
      }
    }
    setResults(newResults)
    setQuestion(prevState => ({
      ...prevState,
      answers: prevState.answers.map(
        answer => answer.code === selectedAnswer.code ? {
          ...answer, selected: false, showFreeAnswer: false, text: '', focus: true
        } : answer
      ).map(
        answer => newResults[question.id].data.length ? answer : ({ ...answer, disabled: false })
      ).map(
        answer => {
          let excludePool = []
          // формирование пула кодов которые запрещены в результатах 
          for (let code in logic.criticalExclude) {
            if (code === answer.code) {
              excludePool = [
                ...excludePool,
                ...logic.criticalExclude[code]
              ]
            }
            if (logic.criticalExclude[code].includes(answer.code)) {
              excludePool = [
                ...excludePool,
                code
              ]
            }
          }
          for (let i = 0; i < excludePool.length; i++) {
            if (newResults.pool.includes(excludePool[i])) {
              return {
                ...answer,
                disabled: true,
                excludeM: `противоречит коду ${excludePool[i]}`
              }
            }
          }
          return {
            ...answer,
            disabled: false,
            excludeM: ''
          }
        }
      ).map(answer => {
        // проверка на уникальность
        if (newResults[question.id].data.length) {
          return answer.unique ? { ...answer, disabled: true } : answer
        }
        return answer
      })
    }))
    return newResults
  }

  const blurHandle = (selectedAnswerId, value) => {
    const selectedAnswer = question.answers.filter(answer => answer.id === selectedAnswerId)[0]
    if (value !== '') {
      const result = {
        answerCode: selectedAnswer.code,
        answerId: selectedAnswer.id,
        freeAnswer: false,
        freeAnswerText: value
      }
      let newResultState = {}
      if (results.pool.includes(selectedAnswer.code)) {
        newResultState = Object.assign({}, results);
        newResultState[question.id] = {
          ...newResultState[question.id],
          data: results[question.id].data.map(
            answer => answer.answerCode === selectedAnswer.code ? { ...answer, freeAnswerText: value } : answer
          )
        }
      } else {
        newResultState = Object.assign({}, results);
        newResultState[question.id].data.push(result)
        newResultState.pool.push(selectedAnswer.code)
      }
      setResults(newResultState)

      // проверить на уникальность (ВНЕШНЯЯ ЛОГИКА - уникальность) -> запретить другие ответы
      if (logic.unique.includes(selectedAnswer.code)) {
        setQuestion(prevState => ({
          ...prevState,
          answers: prevState.answers.map(
            answer => answer.id === selectedAnswer.id ? answer : { ...answer, disabled: true }
          )
        }))
      }
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => {
            return answer.code === selectedAnswer.code ? { ...answer, selected: true, text: value, focus: false } : answer
          }
        ).map(
          answer => logic.unique.includes(answer.code) & answer.code !== selectedAnswer.code ? { ...answer, disabled: true } : answer
        ).map(
          answer => selectedAnswer.exclude.includes(answer.code) ? {
            ...answer,
            disabled: true,
            excludeM: `противоречит коду ${selectedAnswer.code}`
          } : answer
        )
      }))
    } else {
      canclePreviousResult(selectedAnswer)
    }
  }

  const multipleHandler = (option, type) => {
    switch (type) {
      case 'add':
        const newResults = storeSelectedResult(option.option)
        // ПРОВЕРКА на окончание ввода
        if (checkRespondentFinish(newResults)) {
          return
        } else {
          // проверка на ЛИМИТ (для автоматического перехода к следующему вопросу)
          if (results[question.id].data.length >= question.limit) {
            // переходим дальше
            setTimeout(() => {
              goToNext()
            }, STEP_DELAY)
            return
          }
        }
        return
      case 'sub':
        canclePreviousResult(option.option)
        return
      case 'clear':
        resetAnswers()
        return
      default:
        return
    }
  }

  const finishRespondent = () => {
    setFinishDialog(true)
  }

  const codesShow = (e) => {
    setUserSettings(prevState => ({
      ...prevState,
      codesShow: !prevState.codesShow
    }))
  }

  const cancelFinish = () => {
    // просто возврат к анкете, чтобы что-то поправить
    setFinishDialog(false)
  }

  const confirmFinish = () => {
    // закончить данную анкету и начать новую, сбросив все данные
    saveWorksheet(results)
    setResults({
      pool: []
    })
    setUserBack(true)
    setCount(0)
    setFinish(false)
    setFinishDialog(false)
  }

  const finishThisPoll = () => {
    // закончить данный опрос и перейти на главную страницу
    setFinish(false)
    setUserBack(true)
    setFinishDialog(false)
    saveAndGoBack(results)
  }

  const InlineInformer = () => {
    return (
      <Typography variant="overline" display="block" gutterBottom>
        {inlineMessage}
      </Typography>
    )
  }

  return (
    <Fragment>
      <Prompt
        when={results.pool.length}
        message={() => {
          return userBack
            ? true
            : "Вы действительно хотите покинуть страницу ввода данных. Сохраненные данные будут потеряны!"
        }}
      />
      <FinishDialog open={finishDialog} handleClose={cancelFinish} finishAll={finishThisPoll} confirm={confirmFinish} />
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item container xs={6} md={3} justify="flex-start">
          <FormControlLabel
            value="end"
            control={<Checkbox color="primary" onChange={codesShow} defaultChecked={userSettings.codesShow} />}
            label="Коды ответов"
            labelPlacement="end"
          />
        </Grid>
        <Hidden only={['sm', 'xs']}>
          <Grid item container md={6} justify="center">
            <InlineInformer />
          </Grid>
        </Hidden>
        <Grid item container xs={6} md={3} justify="flex-end">
          <p>Всего: <span><strong>{questionsLimit}</strong></span></p>
        </Grid>
        <Hidden mdUp>
          <Grid item container xs={12} justify="center">
            <InlineInformer />
          </Grid>
        </Hidden>
        {question &&
          <QuestionCard
            visibleCount={visibleCount}
            question={question}
            settings={userSettings}
            key={question.id}
            updateState={updateState}
            blurHandle={blurHandle}
            multipleHandler={multipleHandler}
          />
        }
      </Grid>

      <Button onClick={goToPrevious} variant="contained" className="control-button">Назад</Button>
      <Button onClick={goToNext} variant="contained" className="control-button">Вперед</Button>
      {finish &&
        <Button onClick={finishRespondent} variant="contained" className="control-button">Финиш</Button>
      }
    </Fragment>
  )
}

export default DriveLogicEx