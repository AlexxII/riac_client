import React, { useState, useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 500,
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  errorText: {
    color: 'red'
  }
}));

export default function Tags({ data, limit, settings, multipleHandler }) {
  const classes = useStyles();
  const [answers, setAnswers] = useState([])
  const [codes, setCodes] = useState([])
  const [error, setError] = useState({
    state: false,
    text: ''
  })

  useEffect(() => {
    const defVal = data.filter(val => {
      if (val.selected) return val
    })
    const codesOfAnswers = data.map(val => val.code)
    setCodes(codesOfAnswers)
    setAnswers(defVal)
  }, [])

  const handleAnswerSelect = (e, value, reason) => {
    switch (reason) {
      case 'select-option':
        if (value.length > limit) {
          setError({ state: true, text: 'Максимальное количество ответов' })
          return
        }
        setAnswers(value)
        setError({ ...error, state: false })
        break
      case 'remove-option':
        setAnswers(value)
        setError({ ...error, state: false })
        break
      case 'clear':
        setAnswers([])
        setError({ ...error, state: false })
        break
      default:
        break
    }
  }

  const blurHandler = (e) => {
    setError({ ...error, state: false })
    multipleHandler(answers, codes)
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple={limit > 1}
        id="tags-standard"
        options={data}
        onChange={handleAnswerSelect}
        value={answers}
        getOptionLabel={(option) => option.title}
        getOptionDisabled={(option) => option.disabled}
        renderOption={(option) => {
          if (settings.codesShow) {
            return <span><span style={{ fontSize: '10px' }}>{option.code}</span> - {option.title}</span>
          }
          return option.title
        }}
        onBlur={blurHandler}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              variant="outlined"
              key={index}
              label={settings.codesShow ?
                <span><span style={{ fontSize: '10px' }}>{option.code}</span> - {option.title}</span> :
                <span>{option.title}</span>
              }
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            error={error.state}
            variant="standard"
            label="Выберите ответы"
            helperText={error.state ? error.text : ''}
          />
        )}
      />
    </div>
  );
}