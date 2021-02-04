import React, { Fragment, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Prompt } from 'react-router-dom'

import Question from '../Question'
import FinishDialog from '../FinishDialog';
import ConfirmDialog from '../../../../components/ConfirmDialog'

import defineSelectedAnswer from '../../lib/defineSelectedAnswer'
import questionFormation from '../../lib/questionFormation'
import questionFormationEx from '../../lib/questionFormationEx'
import beep from '../../lib/beep'

const KEY_TYPE = 'keyup'
const STEP_DELAY = 0
const MOVE_DELAY = 0

const ANSWER_SELECTED = 1
const RESET_RESULTS = 2
const CONFIRM_QUESTION = 3
const SKIP = 4

const DriveLogic = ({ poll, logics, setCurrentQuestion, saveAndGoBack, saveWorksheet }) => {
  const questionsLimit = poll.questions.length
  const [question, setQuestion] = useState(null)
  const [userSettings, setUserSettings] = useState({
    codesShow: true
  })
  const [earlyСompletion, setEarlyСompletion] = useState(false)
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
  const keyUpHandler = ({ target, keyCode }) => {
    if (target.nodeName === 'BODY') {
      const nextStep = defineSelectedAnswer(keyCode)
      switch (nextStep.do) {
        case ANSWER_SELECTED: {
          mainLogic(nextStep.trueCode)
          return
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
  }
  const confirmResults = () => {
    if (finish) {
      finishRespondent()
    } else {
      if (results[question.id].data.length) {
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

  useEffect(() => {
    document.addEventListener(KEY_TYPE, keyUpHandler)
    return () => {
      document.removeEventListener(KEY_TYPE, keyUpHandler)
    };
  })

  // Кнопка с треброванием выдать ID и сохранить !!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    // первичная инициализация, наложение логики и сохранение в стор следующего вопроса + восстановление промежуточных итогов
    const newQuestion = questionFormation(poll, count, results, logic, setResults);
    if (!newQuestion) return
    if (newQuestion.next) {
      if (direction) {
        if (count === questionsLimit - 1) {
          console.log(results);
          checkRespondentFinish(newQuestion.results)
          // setEarlyСompletion(true)
          return
        }
        setCount(count + 1)
      } else {
        setCount(count - 1)
      }
      return
    }
    setQuestion(newQuestion.data)
    setVisibleCount(count)
    setCurrentQuestion(newQuestion.data)
  }, [count])

  const codesShow = (e) => {
    setUserSettings(prevState => ({
      ...prevState,
      codesShow: !prevState.codesShow
    }))
  }

  // проверка заполненности всех ответов
  const checkRespondentFinish = (newResults) => {
    let count = 0
    for (let key in newResults) {
      if (key !== 'pool') {
        count++
      }
    }
    console.log(count, poll.questions.length);
    // проверка - если не дошли до конца анкета, нет смысла анализировать концовку
    if (count < poll.questions.length) {
      console.log('не до конца');
      return false
    }
    for (let key in newResults) {
      if (key !== 'pool') {
        const result = newResults[key]
        if (!result.data.length) {
          // необходимо проверить - пропущен был вопрос или нет
          if (logic.criticalExclude) {
            const resPool = newResults.pool                // уже сохраненные ответы
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
            console.log('22222222');
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

  const finishRespondent = () => {
    setFinishDialog(true)
  }

  // ОСНОВНЫЙ обработчик сброса ответов
  const resetAnswers = () => {
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
      answers: prevState.answers.map(
        answer => true ? {
          ...answer,
          selected: false,
          showFreeAnswer: false,
          freeAnswerText: '',                             // сбрасываем свободный ответ
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
    setFinish(false)
  }

  // ============ ОСНОВНОЙ обработчик логики ==============
  const mainLogic = (code) => {
    const trueCode = +code
    // движение по опросу
    if (trueCode === 39) { // клавиша вправо
      setTimeout(() => {
        goToNext()
      }, MOVE_DELAY)
      return
    } else if (trueCode === 37) { // клавиша влево
      setTimeout(() => {
        goToPrevious()
      }, MOVE_DELAY)
      return
    }
    const keyCodesPool = question.keyCodesPool
    // входит ли код клавиатуры в перечень ответов
    if (keyCodesPool !== undefined && keyCodesPool.includes(trueCode)) {
      const selectedAnswer = question.answers.filter(answer => answer.keyCode === trueCode)[0]
      // промежуточные результаты уже содержат выбранный код => удаляем промежуточный результат => обновляем текущий вью
      if (results.pool.includes(selectedAnswer.code)) {
        canclePreviousResult(selectedAnswer)
        return
      }
      // проверка на уникальность ответа и выбраннного до этого противоречивого ответа (ВНЕШНЯЯ ЛОГИКА - уникальность)
      if (logic.unique.includes(selectedAnswer.code)) {
        if (results[question.id].data.length) {
          beep()
          return
        }
      }
      // проверка на активность ответа и ограничение по количеству ответов
      if (selectedAnswer.disabled || results[question.id].data.length >= question.limit) {
        beep()
        return
      }
      // проверка на свободный ответ
      if (selectedAnswer.freeAnswer) {
        setQuestion(prevState => ({
          ...prevState,
          answers: prevState.answers.map(
            answer => answer.keyCode === selectedAnswer.keyCode ? { ...answer, selected: true, showFreeAnswer: true } : answer
          )
        }))
        return
      }

      const newResults = storeSelectedResult(selectedAnswer)

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
    } else {
      beep()
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

  // функция отмены ранее сохраненного ответа на вопрос
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
          ...answer, selected: false, showFreeAnswer: false, freeAnswerText: '', focus: true
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
    return
  }

  // ОСНОВНОЙ обработчик свободного ответа
  const blurHandler = (e) => {
    const value = e.currentTarget.value
    const selectedCode = e.currentTarget.dataset.code
    const selectedKeyCode = e.currentTarget.dataset.keycode
    const selectedAnswer = question.answers.filter(obj => obj.keyCode === +selectedKeyCode)[0]
    if (value === '') {
      // пустое поле не позволительно -> стираем из промежуточного результата и обновляем вью
      let newResults = {}
      for (let key in results) {
        if (key === question.id) {
          newResults = {
            ...newResults,
            [question.id]: {
              ...results[question.id],
              data: results[question.id].data.filter(el => el.answerCode !== selectedCode)
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
              pool: results.pool.filter(el => el !== selectedCode)
            }
          }
        }
      }
      setResults(newResults)
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.code === selectedCode ? {
            ...answer, selected: false, showFreeAnswer: false, freeAnswerText: ''
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
      return
    }
    // поле не пустое -> сохраняем результат
    const result = {
      answerCode: selectedCode,
      answerId: selectedAnswer.id,
      freeAnswer: false,
      freeAnswerText: value
    }
    /// опять новый СТЕЙТ результата!!!!!!!!!!!
    let newResultState = {}
    if (results.pool.includes(selectedCode)) {
      newResultState = Object.assign({}, results);
      newResultState[question.id] = {
        ...newResultState[question.id],
        data: results[question.id].data.map(
          answer => answer.answerCode === selectedCode ? { ...answer, freeAnswerText: value } : answer
        )
      }
    } else {
      newResultState = Object.assign({}, results);
      newResultState[question.id].data.push(result)
      newResultState.pool.push(selectedCode)
    }
    setResults(newResultState)

    // проверить на уникальность (ВНЕШНЯЯ ЛОГИКА - уникальность) -> запретить другие ответы
    if (logic.unique.includes(selectedCode)) {
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
          return answer.code === selectedCode ? { ...answer, selected: true, freeAnswerText: value, focus: false } : answer
        }
      ).map(
        answer => logic.unique.includes(answer.code) & answer.code !== selectedCode ? { ...answer, disabled: true } : answer
      ).map(
        answer => selectedAnswer.exclude.includes(answer.code) ? {
          ...answer,
          disabled: true,
          excludeM: `противоречит коду ${selectedAnswer.code}`
        } : answer
      )
    }))

    if (checkRespondentFinish(newResultState)) {
      return
    } else {
      if (results[question.id].data.length >= question.limit - 1) {         // -1 т.к. не успевает обновится стейт
        setTimeout(() => {
          goToNext()
        }, STEP_DELAY)
      }
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

  const handleEarlyСompletion = () => {
    setResults({
      pool: []
    })
    setCount(0)
    setEarlyСompletion(false)
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
      <ConfirmDialog
        open={earlyСompletion}
        confirm={handleEarlyСompletion}
        config={{
          confirmBtn: "Заново"
        }}
        data={
          {
            title: 'Анкета досрочно завершена',
            content: 'Внимание! Вносимые данные противоречат условиям проведения данного опроса. Вероятно был выбран код, который привел к завершению. Посмотрите конфигурационный файл.'
          }
        }
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

      </Grid>
      {question &&
        <Question
          count={visibleCount}
          question={question}
          settings={userSettings}
          clickHandler={mainLogic}
          blurHandler={blurHandler}
          multipleHandler={multipleHandler}
        />
      }
      <Button onClick={goToPrevious} variant="contained" className="control-button">Назад</Button>
      <Button onClick={goToNext} variant="contained" className="control-button">Вперед</Button>
      {finish &&
        <Button onClick={finishRespondent} variant="contained" className="control-button">Финиш</Button>
      }
    </Fragment>
  )
}

export default DriveLogic