import React, { Fragment, useEffect, useState, useCallback } from 'react'
import Question from './components/Question'

import defineSelectedAnswer from '../../lib/defineSelectedAnswer'
import questionFormation from '../../lib/questionFormation'
import mainLogic from '../../lib/mainLogic'

const KEY_TYPE = 'keyup'

const PollDrive = ({ poll }) => {
  const questionsLimit = poll.pollData.questions.length

  const [question, setQuestion] = useState(false)
  const [logic, setLogic] = useState([
    {
      code: '001',
      skip: true
    },
    {
      code: '004',
      banned: true
    }
  ])
  const [count, setCount] = useState(0)
  const [listen, setListen] = useState(true)

  const keyUpHandler = ({target, keyCode}) => {
    if (target.nodeName == 'BODY') {
      const trueCode = defineSelectedAnswer(keyCode)
      console.log(trueCode);
      if (!trueCode) return                                       // нажата системная клавиша, не относящаяся к опросу
      console.log(question);
      // mainLogic(code, count, question, logic, setCount, setQuestion)
    } else {
      console.log('input');
    }
  }

  useEffect(() => {
    if (listen) {
      document.addEventListener(KEY_TYPE, keyUpHandler)
      return () => {
        document.removeEventListener(KEY_TYPE, keyUpHandler)
      };
    }
    return
  }, [])

  const logicWrap = (code) => {
    mainLogic(code, count, question, logic, setCount, setQuestion)
  }

  // Кнопка с треброванием выдать ID и сохранить !!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    // первичная инициализация, наложение логики и сохранение в стор следующего вопроса + восстановление промежуточных итогов
    const result = questionFormation(poll, count);
    if (result.next) {
      // все ответы забанены
      setCount(count + 1)
    } else {
      setQuestion(result.data)
    }
  }, [count])

  const clickHandler = (target) => {
    const code = target.dataset.code
    logicWrap(code)
  }

  const focusHandler = (e) => {
    // document.removeEventListener(KEY_TYPE, keyUpHandler)
  }

  const blurHandler = (e) => {
    console.log('Свободный ответ - ', e.currentTarget.value);
    // если свободный ответ пуст - снять выбор со всего ответа
    // document.addEventListener(KEY_TYPE, keyUpHandler)
  }

  return (
    <Fragment>
      <button onClick={() => setListen(true)}>
        Восстановить
      </button>
      {question &&
        <Question question={question}
          clickHandler={clickHandler}
          focusHandler={focusHandler}
          blurHandler={blurHandler}
        />
      }
    </Fragment>
  )
}

export default PollDrive