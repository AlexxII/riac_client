import React, { Fragment, useEffect, useState, useCallback, useRef } from 'react'
import Question from './components/Question'

import defineSelectedAnswer from '../../lib/defineSelectedAnswer'
import questionFormation from '../../lib/questionFormation'
import mainLogic from '../../lib/mainLogic'

const KEY_TYPE = 'keyup'

const PollDrive = ({ poll }) => {
  const [question, setQuestion] = useState(false)
  const [keyCode, setKeyCode] = useState(0)
  const [count, setCount] = useState(0)

  const handler = useCallback(
    (e) => {
      // ({ target, keyCode }) => {
      console.log(e);
      // console.log(target, keyCode);
      setKeyCode(keyCode);
      console.log(question);
    },
    [keyCode]
  );

  useEventListener('keyup', handler);

  const test = () => {
    console.log(question);
  }

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
    // logicWrap(code)
  }

  const focusHandler = (e) => {
    // document.removeEventListener(KEY_TYPE, handler)
  }

  const blurHandler = (e) => {
    console.log('Свободный ответ - ', e.currentTarget.value);
    // document.addEventListener(KEY_TYPE, handler)
  }

  return (
    <Fragment>
      {/* <button onClick={() => setListen(true)}>
        Восстановить
      </button> */}
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


function useEventListener(eventName, handler, element = window) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      // On 
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = event => savedHandler.current(event);

      // Add event listener
      element.addEventListener(eventName, eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element] // Re-run if eventName or element changes
  );
};