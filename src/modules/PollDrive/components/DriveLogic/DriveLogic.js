import React, { Fragment, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import QuestionCard from '../QuestionCard'
import defineSelectedAnswer from '../../lib/defineSelectedAnswer'
import questionFormationEx from '../../lib/questionFormationEx'

import beep from '../../lib/beep'

const KEY_TYPE = 'keyup'

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

const DriveLogic = React.memo(props => {
  const {
    poll, logic, cityCode, userSettings, results, setResults, setFinishDialog,
    finish, setFinish, setCount, count, finishNode, update, resetDriveResults,
    currentCity, user
  } = props
  const questionsLimit = poll.questions.length
  const [question, setQuestion] = useState(null)
  const [codesShow, setCodesShow] = useState(true)
  const [direction, setDirection] = useState(1)
  const [visibleCount, setVisibleCount] = useState(0)
  const [inlineMessage, setInlineMessage] = useState('')
  const [oldResults] = useState(results)

  useEffect(() => {
    window.addEventListener(KEY_TYPE, keyUpHandler)
    return () => {
      window.removeEventListener(KEY_TYPE, keyUpHandler)
    };
  })
  useEffect(() => {
    // первичная инициализация, наложение логики и сохранение в стор следующего вопроса + восстановление промежуточных итогов
    const nextQuestion = questionFormationEx(poll.questions[count], count, logic, cityCode, results, setResults);
    if (nextQuestion.skip) {
      if (direction) {
        if (count === questionsLimit - 1) {
          checkRespondentFinish(nextQuestion.results)
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
    // для свободных ответов пропускаем логику
    if (target.nodeName === 'INPUT' && (target.type !== 'checkbox' && target.type !== 'radio')) return
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

  const confirmResults = () => {
    if (finish) {
      setFinishDialog(true)
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

  // ОСНОВНОЙ обработчик сброса ответов
  const resetAnswers = () => {
    if (results.pool.length) {
      const savedCodes = results[question.id].data.reduce((acum, val) => [...acum, val.answerCode], [])
      // Сделано так, чтобы не ждать обновления СТЕЙТА с результатами
      let newResults = {}
      for (let key in results) {
        if (key === question.id) {
          newResults[question.id] = {
            ...results[question.id],
            data: []
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
              pool: results.pool.filter(code => {
                return savedCodes.includes(code) ? false : true
              })
            }
          }
        }
      }
      setResults(newResults)
      checkRespondentFinish(newResults)
      setQuestion(prevState => ({
        ...prevState,
        selectedAnswer: '',
        answers: prevState.answers.map(
          answer => true ? {
            ...answer,
            selected: false,
            showFreeAnswer: false,
            text: '',                                       // сбрасываем свободный ответ
            focus: true,                                    // чтобы фокус вернулся на свободеый ответ, т.к. он сброшен 
            disabled: false
          } : answer
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
        )
      }))
      return newResults
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
    const newResults = storeSelectedResult(selectedAnswer)
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
    if (newResults[question.id].data.length >= question.limit) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.selected ? answer : { ...answer, disabled: true }
        )
      }))
      return
    }
    if (checkRespondentFinish(newResults)) {
      return
    } else {
      // проверка на ЛИМИТ (для автоматического перехода к следующему вопросу)
      if (results[question.id].data.length >= question.limit && userSettings.autoStep) {
        // переходим дальше
        setTimeout(() => {
          goToNext()
        }, userSettings.stepDelay)
        return
      }
    }
  }

  const setRadioAnswer = (selectedAnswer) => {
    // проверить если выбран уже сохраненный ответ
    if (selectedAnswer.disabled) return
    if (results.pool.includes(selectedAnswer.code)) return
    const newResults = resetAnswers()
    storeSelectedResult(selectedAnswer, newResults)
    if (selectedAnswer.freeAnswer) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.keyCode === selectedAnswer.keyCode ? { ...answer, selected: true, focus: true } : answer
        )
      }))
      return
    }
    if (checkRespondentFinish(newResults)) {
      return
    } else {
      // проверка на ЛИМИТ (для автоматического перехода к следующему вопросу)
      if (userSettings.autoStep) {
        // переходим дальше
        setTimeout(() => {
          goToNext()
        }, userSettings.stepDelay)
        return
      }
    }
  }

  // снят ответ на вопрос
  const unsetAnswer = (selectedAnswer) => {
    canclePreviousResult(selectedAnswer)
  }

  const checkRespondentFinish = (newResults) => {
    let resCount = 0
    for (let key in newResults) {
      if (key !== 'pool') {
        resCount++
      }
    }
    // проверка - если не дошли до конца анкета, нет смысла анализировать концовку
    if (resCount < poll.questions.length && !update) {
      return false
    }
    for (let key in newResults) {
      if (key !== 'pool') {
        const result = newResults[key]
        if (!result.data.length) {
          // необходимо проверить - пропущен был вопрос или нет
          if (logic.criticalExclude) {
            const resPool = newResults.pool                                   // уже сохраненные ответы
            const codesPool = result.codesPool
            const criticalExclude = logic.criticalExclude
            const r = codesPool.filter((code, index) => {
              for (let eCode in criticalExclude) {
                if (resPool.includes(eCode)) {
                  if (criticalExclude[eCode].includes(code)) return false
                }
              }
              return true
            })
            if (r.length) {
              setInlineMessage(`Пропущен ${result.count + 1}й вопрос`)
              if (question.limit < 2) {
                setCount(result.count)
              }
              setFinish(false)
              // чтобы он не перешел к след. ответу
              return true
            }
          } else {
            // пула критичных ответов нет -> запрещенных вопросов нет -> какой-то вопрос пропущен
            // ОПРЕДЕЛИТЬ какой номер вопроса
            setInlineMessage(`Пропущен ${result.count + 1}й вопрос`)
            if (question.limit < 2) {
              setCount(result.count)
            }
            setFinish(false)
            // чтобы он не перешел к след. ответу
            return true
          }
        }
      }
    }
    setInlineMessage('')
    setFinish(true)
    return true
  }

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
  const storeSelectedResult = (selectedAnswer, newResults) => {
    console.log(selectedAnswer)
    const freshResults = newResults ? newResults : results
    const result = {
      answerCode: selectedAnswer.code,
      answerId: selectedAnswer.id,
      freeAnswer: false,
      freeAnswerText: ''
    }
    // проверка на исключаемость (ВНЕШНЯЯ ЛОГИКА - КРИТИЧНАЯ исключаемость) -> запретить ответы, которые указаны в конфиг файле
    for (let code in logic.criticalExclude) {
      // если в выбранных ответах присутствует код, который исключает другие ответы
      if (freshResults.pool.includes(code)) {
        if (logic.criticalExclude[code].includes(selectedAnswer.code)) {
          beep()
          return
        }
      }
    }
    let newResultState = Object.assign({}, freshResults);
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
    checkRespondentFinish(newResults)
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
      /// опять новый СТЕЙТ результата!!!!!!!!!!!
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
      checkRespondentFinish(newResultState)
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
            }, userSettings.stepDelay)
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

  const handleCodesShow = () => {
    setCodesShow(!codesShow)
  }

  const onReset = () => {
    resetAnswers()
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
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item container xs={6} md={3} justify="flex-start">
          <FormControlLabel
            value="end"
            control={<Checkbox color="primary" onChange={handleCodesShow} defaultChecked={codesShow} />}
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
          <Tooltip title={<span>Место проведения: {currentCity?.title}<br />Интервьюер: {user?.username}</span>}>
            <InfoOutlinedIcon className="informer" />
          </Tooltip>
          <p>Всего: <span><strong>{questionsLimit}</strong></span></p>
        </Grid>
        <Hidden mdUp>
          <Grid item container xs={12} justify="center">
            <InlineInformer />
          </Grid>
        </Hidden>
        <Grid container direction="row" justify="center" alignItems="center" className="card-service-wrap">
          <Button onClick={goToPrevious} variant="contained" size="small" className="control-button">Назад</Button>
          <Button onClick={goToNext} variant="contained" size="small" className="control-button">Вперед</Button>
          {finish &&
            finishNode
          }
          <Tooltip title="Сбросить все данные" aria-label="add">
            <IconButton color="secondary" aria-label="reset surve" component="span" onClick={resetDriveResults} className="reset-all-btn">
              <RotateLeftIcon />
            </IconButton>
          </Tooltip>
        </Grid>
        {question &&
          <QuestionCard
            visibleCount={visibleCount}
            question={question}
            codesShow={codesShow}
            key={question.id}
            updateState={updateState}
            blurHandle={blurHandle}
            multipleHandler={multipleHandler}
            reset={onReset}
          />
        }
      </Grid>

    </Fragment>
  )
}
)

export default DriveLogic