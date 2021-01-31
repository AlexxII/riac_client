import React, { useEffect, useRef } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
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
    if (e.keyCode === 13) {
      inputEl.current.blur()
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
              onKeyDown={keyDownHandle}
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
      value={answer.id}
      key={answer.id}
      control={<Radio />}
      className="other-radio-label"
      label={
        <AnswerTitle />
      }
      disabled={answer.disabled}
    />
  )
}

export default OtherRadio