import React from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

const OtherCheckbox = ({ placeholder }) => {

  const onChange = () => {

  }

  const onTextChange = () => {

  }

  return (
    <FormControlLabel
      className="other-check-label"
      control={
        <Checkbox
          onChange={onChange}
          checked={false}
        // disabled={index === 3}
        />
      }
      label={
        <TextField
          id="standard-bare"
          placeholder={placeholder}
          margin="normal"
          onChange={onTextChange}
          className="checkbox-control-label"
        />
      }
    />
  )
}

export default OtherCheckbox