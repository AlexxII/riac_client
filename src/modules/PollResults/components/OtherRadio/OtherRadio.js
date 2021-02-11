import React, { useEffect, useRef } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';
import { Fragment } from "react";

const OtherRadio = ({ answer, settings, onBlur }) => {
  const inputEl = useRef(null)
  useEffect(() => {
    inputEl.current.value = answer.text
    if (answer.focus) {
      inputEl.current.focus()
    }
  })

  const keyDownHandle = (e) => {
    let keyCode = e.keyCode
    if (keyCode === 13) {
      inputEl.current.blur()
      return
    } else if (keyCode === 27) {
      if (inputEl.current.value !== '') {
        inputEl.current.value = ''
        return
      }
      inputEl.current.blur()
      return
    }
  }

  const handleBlur = () => {
    const val = inputEl.current.value
    onBlur(answer.id, val)
  }

  const AnswerTitle = () => {
    if (settings.codesShow) {
      return (
        <Fragment>
          <span className="other-title-container">
            <span className="answer-code">{answer.code} - </span>
            <TextField
              id="standard-bare"
              inputRef={inputEl}
              placeholder={answer.title}
              margin="normal"
              onBlur={handleBlur}
              onKeyUp={keyDownHandle}
              className="radio-control-label"
            />
          </span>
        </Fragment>
      )
    } else {
      return (
        <TextField
          id="standard-bare"
          inputRef={inputEl}
          placeholder={answer.title}
          margin="normal"
          onBlur={handleBlur}
          onKeyDown={keyDownHandle}
          className="radio-control-label"
        />
      )
    }
  }

  return (
    <FormControlLabel
      className="radio-control-label other-radio-label"
      value={answer.id}
      key={answer.id}
      control={
        <Fragment>
          <span className="key-code">{answer.showIndex}</span>
          <Radio
            checked={answer.selected}
            disabled={answer.disabled}
            value={answer.id}
          />
        </Fragment>
      }
      label={
        <AnswerTitle />
      }
      disabled={answer.disabled}
    />
  )
}

export default OtherRadio