import React, { useRef, useEffect } from 'react'

const FreeAnswer = ({ answer, focusHandler, blurHandler }) => {
  const textInput = useRef(null);
  useEffect(() => {
    if (answer.focus) {
      textInput.current.focus()
    }
    if (answer.freeAnswerText !== '') {
      textInput.current.value = answer.freeAnswerText
    }
  }, [])

  const handlerInput = (e) => {
    let keyCode = e.keyCode
    if (keyCode === 13) {
      e.currentTarget.blur()
      return
    } else if (keyCode === 27) {
      if (textInput.current.value !== '') {
        textInput.current.value = ''
        return
      }
      e.currentTarget.blur()
      return
    }
  }

  if (answer.showFreeAnswer) {
    return (
      <input
        className="free-answer"
        type="text"
        ref={textInput}
        data-code={answer.code}
        data-keycode={answer.keyCode}
        placeholder="Введите свободный ответ"
        onKeyUp={handlerInput}
        onFocus={focusHandler}
        onBlur={blurHandler}
      />
    )
  }
  return null
}

export default FreeAnswer