import React, { useRef, useEffect } from 'react'

const FreeAnswer = ({ answer, focusHandler, blurHandler }) => {
  const textInput = useRef(null);
  useEffect(() => {
    textInput.current.focus()
  }, [])

  if (answer.showFreeAnswer) {
    return (
      <input
        type="text"
        ref={textInput}
        placeholder="Введите свободный ответ"
        onFocus={focusHandler}
        onBlur={blurHandler}
      />
    )
  }
  return null
}

export default FreeAnswer