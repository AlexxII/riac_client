import React, { useState, useEffect } from 'react';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
  errorText: {
    color: 'red'
  }
}));

const MultipleAnswers = ({ data, limit, settings, multipleHandler }) => {
  const classes = useStyles();
  const [answers, setAnswers] = useState([])
  const [error, setError] = useState({
    state: false,
    text: ''
  })

  useEffect(() => {
    const defVal = data.filter(val => {
      return val.selected
    })
    if (limit < 2) {
      // autocomplete при multiple не смотрит в массив
      setAnswers(defVal !== undefined ? defVal[0] : [])
    } else {
      setAnswers(defVal)
    }
  }, [])

  const handleAnswerSelect = (e, value, reason, option) => {
    switch (reason) {
      case 'select-option':
        if (value.length > limit) {
          setError({ state: true, text: 'Максимальное количество ответов' })
          return
        }
        const addedOption = { ...option }
        multipleHandler(addedOption, 'add')
        setAnswers(value)
        setError({ ...error, state: false })
        break
      case 'remove-option':
        const deletedOption = { ...option }
        multipleHandler(deletedOption, 'sub')
        setAnswers(value)
        setError({ ...error, state: false })
        break
      case 'clear':
        // удалить все ответы
        multipleHandler([], 'clear')
        setAnswers([])
        setError({ ...error, state: false })
        break
      default:
        break
    }
  }

  return (
    <div className={classes.root}>
      <Autocomplete
        multiple={limit > 1}
        id="tags-standard"
        options={data}
        onChange={handleAnswerSelect}
        value={answers}
        freeSolo
        disableCloseOnSelect={limit > 1}
        getOptionLabel={(option) => option.title}
        getOptionDisabled={(option) => option.disabled}
        renderOption={(option) => {
          if (settings.codesShow) {
            return <span><span style={{ fontSize: '10px' }}>{option.code}</span> - {option.title}</span>
          }
          return option.title
        }}
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

export default MultipleAnswers