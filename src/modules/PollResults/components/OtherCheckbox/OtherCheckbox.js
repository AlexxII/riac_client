import React, { Fragment, useEffect, useRef } from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const OtherCheckbox = ({ answer, onChange, codesShow, onBlur }) => {
  const inputEl = useRef(null)
  useEffect(() => {
    inputEl.current.value = answer.text
    if (answer.focus) {
      inputEl.current.focus()
    }
  })

  const keyDownHandle = (e) => {
    const keyCode = e.keyCode
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
    if (codesShow) {
      return (
        <Fragment>
          <span className="other-title-container">
            <span className="answer-code">{answer.code} - </span>
            <TextField
              id="standard-bare"
              inputRef={inputEl}
              name={answer.id}
              placeholder={answer.title}
              margin="normal"
              onKeyUp={keyDownHandle}
              onBlur={handleBlur}
              className="checkbox-control-label"
            />
          </span>
        </Fragment>
      )
    } else {
      return (
        <TextField
          id="standard-bare"
          inputRef={inputEl}
          name={answer.id}
          placeholder={answer.title}
          margin="normal"
          onKeyDown={keyDownHandle}
          onBlur={handleBlur}
          className="checkbox-control-label"
        />
      )
    }
  }

  return (
    <FormControlLabel
      className="checkbox-control-label other-check-label"
      key={answer.id}
      control={
        <Fragment>
          <span className="key-code">{answer.showIndex}</span>
          <Checkbox
            onChange={onChange}
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

export default OtherCheckbox