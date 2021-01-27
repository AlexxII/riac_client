import React from "react";

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import TextField from '@material-ui/core/TextField';

const OtherRadio = ({ placeholder }) => {

  const onChange = () => {

  }

  const onTextChange = () => {

  }

  return (
    <FormControlLabel
      // value={value}
      onChange={onChange}
      checked={false}
      control={<Radio />}
      label={
        <TextField
          id="standard-bare"
          placeholder={placeholder}
          margin="normal"
          onChange={onTextChange}
        />
      }
    />
  )
}

export default OtherRadio