import React, { Fragment, useEffect, useState } from 'react'
import Question from './components/Question'
import Button from '@material-ui/core/Button';

import defineSelectedAnswer from './lib/defineSelectedAnswer'
import questionFormation from './lib/questionFormation'
import beep from './lib/beep'

const KEY_TYPE = 'keyup'
const STEP_DELAY = 200
const MOVE_DELAY = 0

const ANSWER_SELECTED = 1
const RESET_RESULTS = 2
const CONFIRM_QUESTION = 3
const SKIP = 4

const PollDrive = ({ poll, logics, mainDiv, setCurrentQuestion }) => {
  const questionsLimit = poll.questions.length
  const [question, setQuestion] = useState(null)
  const [userSettings, setUserSettings] = useState({
    codesShow: true
  })
  const [direction, setDirection] = useState(1)
  const [logic] = useState(logics)
  const [count, setCount] = useState(0)
  const [results, setResults] = useState(
    {
      pool: []
    }
  )
  const [finish, setFinish] = useState(false)
  const keyUpHandler = ({ target, keyCode }) => {
    if (target.nodeName == 'BODY') {
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
      }
    }
  }
  const confirmResults = () => {
    if (results[question.id].data.length) {
      goToNext()
      return
    }
    beep()
  }

  // ОСНОВНЫЙ обработчик сброса ответов
  const resetAnswers = () => {
    const savedCodes = results[question.id].data.reduce((acum, val) => [...acum, val.answerCode], [])
    // Сделано так, чтобы не ждать обновления СТЕЙТА с результатами
    let newResults = {}
    for (let key in results) {
      if (key === question.id) {
        newResults[question.id] = {
          data: [],
          skip: false
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
    setQuestion(prevState => ({
      ...prevState,
      answers: prevState.answers.map(
        answer => true ? { ...answer, selected: false, showFreeAnswer: false, disabled: false } : answer
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
                excludeM: `запрещен кодом ${excludePool[i]}`
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
    const arrayOfCodes = question.answers.reduce((acum, val) => [...acum, val.code], [])
    // обновить логику и проверить запрещенные ответы для данного вопроса для их перерисовки!!!!!!
  }

  const mainLogic = (code) => {
    const trueCode = +code
    const keyCodesPool = question.keyCodesPool
    const selectedAnswer = question.answers.filter(obj => obj.keyCode === trueCode)[0]
    // движение по опросу
    if (trueCode === 39) {
      setTimeout(() => {
        goToNext()
      }, MOVE_DELAY)
      return
    } else if (trueCode === 37) {
      setTimeout(() => {
        goToPrevious()
      }, MOVE_DELAY)
      return
    }
    // входит ли код клавиатуры в перечень ответов
    if (keyCodesPool.includes(trueCode)) {
      // промежуточные результаты уже содержат выбранный код => удаляем промежуточный результат => обновляем текущий вью
      if (results.pool.includes(selectedAnswer.code)) {
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
              console.log(newResults);
              newResults = {
                ...newResults,
                [key]: results[key]
              }
              console.log(newResults);
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
            answer => answer.code === selectedAnswer.code ? { ...answer, selected: false, showFreeAnswer: false } : answer
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
                    excludeM: `запрещен кодом ${excludePool[i]}`
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
      const result = {
        answerCode: selectedAnswer.code,
        freeAnswer: false,
        freeAnswerText: ''
      }
      // проверка на исключаемость (ВНЕШНЯЯ ЛОГИКА - КРИТИЧНАЯ исключаемость) -> запретить ответы, которые указаны в конфиг файле
      for (let code in logic.criticalExclude) {
        // если в выбранных ответах присутствует код, который исключает другие ответы
        if (results.pool.includes(code)) {
          if (logic.criticalExclude[code].includes(selectedAnswer.code)) {
            console.log('Ответ запрещен');
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
          answer => answer.keyCode === trueCode ? { ...answer, selected: true } : answer
        ).map(
          answer => logic.unique.includes(answer.code) & answer.keyCode !== trueCode ? { ...answer, disabled: true } : answer
        ).map(
          answer => selectedAnswer.exclude.includes(answer.code) ? {
            ...answer,
            disabled: true,
            excludeM: `запрещен кодом ${selectedAnswer.code}`
          } : answer
        )
      }))
      // проверить на уникальность (ВНЕШНЯЯ ЛОГИКА - уникальность) -> запретить другие ответы
      if (logic.unique.includes(selectedAnswer.code)) {
        setQuestion(prevState => ({
          ...prevState,
          answers: prevState.answers.map(
            answer => answer.keyCode === trueCode ? answer : { ...answer, disabled: true }
          )
        }))
      }
      // проверка на ЛИМИТ (для автоматического перехода к следующему вопросу)
      if (results[question.id].data.length >= question.limit) {
        // переходим дальше
        setTimeout(() => {
          goToNext()
        }, STEP_DELAY)
        return
      }
    } else {
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
        setCount(count + 1)
      } else {
        setCount(count - 1)
      }
      return
    }
    setQuestion(newQuestion.data)
    setCurrentQuestion(newQuestion.data)
  }, [count])

  const clickHandler = (target) => {
    const code = target.dataset.code
    const selectedAnswer = question.answers.filter(obj => obj.keyCode === +code)[0]
    // проверка, если поле со свободным ответом необходимо отредактировать
    if (selectedAnswer.freeAnswer && selectedAnswer.selected) {
      return
    }
    mainLogic(code)
  }

  const blurHandler = (e) => {
    const value = e.currentTarget.value
    const selectedCode = e.currentTarget.dataset.code
    const selectedKeyCode = e.currentTarget.dataset.keycode
    if (value === '') {
      // пустое поле не позволительно -> стираем из промежуточного результата и обновляем вью
      let haveAnswers = results[question.id].data.length
      setResults(prevState => ({
        ...prevState,
        [question.id]: {
          ...prevState[question.id],
          data: prevState[question.id].data.filter(el => el.answerCode !== selectedCode)
        },
        pool: prevState.pool.filter(el => el !== selectedCode)
      }))
      haveAnswers--
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.code === selectedCode ? { ...answer, selected: false, showFreeAnswer: false } : answer
        ).map(
          answer => !!haveAnswers ? answer : ({ ...answer, disabled: false })
        )
      }))
      return
    }
    // поле не пустое -> сохраняем результат
    const result = {
      answerCode: selectedCode,
      freeAnswer: false,
      freeAnswerText: value
    }
    if (results.pool.includes(selectedCode)) {
      setResults(prevState => ({
        ...prevState,
        [question.id]: {
          ...prevState[question.id],
          data: prevState[question.id].data.map(
            answer => answer.answerCode === selectedCode ? { ...answer, freeAnswerText: value } : answer
          )
        },
        pool: [
          ...prevState.pool,
          selectedCode
        ]
      }))
    } else {
      setResults(prevState => ({
        ...prevState,
        [question.id]: {
          ...prevState[question.id],
          data: [
            ...prevState[question.id].data,
            result
          ]
        },
        pool: [
          ...prevState.pool,
          selectedCode
        ]
      }))
    }
    // проверить на уникальность (ВНЕШНЯЯ ЛОГИКА - уникальность) -> запретить другие ответы
    if (logic.unique.includes(selectedCode)) {
      setQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.keyCode === +selectedKeyCode ? answer : { ...answer, disabled: true }
        )
      }))
    }
    setQuestion(prevState => ({
      ...prevState,
      answers: prevState.answers.map(
        answer => logic.unique.includes(answer.code) ? { ...answer, disabled: true } : answer
      ),
    }))

    if (results[question.id].data.length >= question.limit - 1) {         // -1 т.к. не успевает обновится стейт
      setTimeout(() => {
        goToNext()
      }, STEP_DELAY)
    }
  }

  const codesShow = (e) => {
    setUserSettings(prevState => ({
      ...prevState,
      codesShow: !prevState.codesShow
    }))
  }

  // !!!!!!!!!!!!!!!!!!!!Обработчик SELECTa - не доделана логика выбора!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const multipleHandler = (value, codes) => {
    console.log(value, codes);
    if (value.length) {
      const codesPool = value.map(val => val.code)
      const resultsPool = value.map(val => {
        return {
          answerCode: val.code,
          // keyCode: val.keyCode,
          freeAnswer: false,
          freeAnswerText: ''
        }
      })
      const clearPool = results.pool.filter(val => !codes.includes(val))
      setResults(prevState => ({
        ...prevState,
        [question.id]: {
          ...prevState[question.id],
          data: [
            ...resultsPool
          ]
        },
        pool: [
          ...clearPool,
          ...codesPool
        ]
      }))
      if (value.length) {
        setTimeout(() => {
          goToNext()
        }, STEP_DELAY)
      }
      return
    }
    setResults(prevState => ({
      ...prevState,
      [question.id]: {
        ...prevState[question.id],
        data: []
      },
      pool: prevState.pool.filter(obj => !codes.includes(obj))
    }))
  }

  const checkRespondentFinish = () => {

  }

  const finishRespondent = () => {

  }

  return (
    <Fragment>
      <label>
        <input type="checkbox" onChange={codesShow} defaultChecked={userSettings.codesShow} />
        Показывать коды ответов
      </label>
      {question &&
        <Question
          count={count}
          question={question}
          settings={userSettings}
          clickHandler={clickHandler}
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

export default PollDrive