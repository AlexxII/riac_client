import React from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Fragment } from "react";

const OtherRadio = ({ answer, onChange, settings }) => {

  // const onChange = () => {

  // }

  const onTextChange = () => {

  }

  const AnswerTitle = () => {
    if (settings.codesShow) {
      return (
        <Fragment>
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <span className={"answer-code"}>{answer.code} - </span>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="standard-bare"
                value={answer.text}
                placeholder={answer.title}
                margin="normal"
                onChange={onTextChange}
                className="radio-control-label"
              />
            </Grid>
          </Grid>

        </Fragment>
      )
    } else {
      return (
        answer.title
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
      // label={
      //   <Fragment>
      //     <span className={"answer-code"}>{answer.code} - </span>

      //   </Fragment>
      // }
      disabled={answer.disabled}
    />
  )
}

export default OtherRadio