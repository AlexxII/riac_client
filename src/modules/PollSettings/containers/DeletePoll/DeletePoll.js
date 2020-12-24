import React, { Fragment, useState } from 'react'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { useHistory } from "react-router-dom";
import { useMutation } from '@apollo/react-hooks'

import { GET_ALL_ACTIVE_POLLS } from '../../../PollHome/queries'
import { DELETE_POLL } from './mutations'

const DeletePoll = ({ id, code }) => {
  const history = useHistory();
  const [open, setOpen] = useState(false)
  const [incorrect, setIncorrect] = useState(true)
  const [delPoll, { poll }] = useMutation(DELETE_POLL, {
    onCompleted: () => {
      history.push("/")
    }
  })

  const handleClose = () => {
    setOpen(false);
  };

  const handlePollDel = (id) => {
    delPoll({
      variables: {
        id
      },
      refetchQueries: [{ query: GET_ALL_ACTIVE_POLLS }]
    })
  }

  const handleChange = (e) => {
    const text = e.currentTarget.value.toUpperCase()
    e.currentTarget.value = text
    if (text.toUpperCase() === code) {
      setIncorrect(false)
    } else {
      setIncorrect(true)
    }
  }

  const handleDelete = () => {
    handlePollDel(id)
  }

  const deleteQuery = () => {
    setOpen(true);
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Удаление</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <Typography variant="subtitle1" gutterBottom>
              Это действие не может быть отменено.
              Оно приведет к безвозвратному удалению ВСЕХ данных опроса.
            </Typography>
            <Typography variant="button" display="block" gutterBottom>
              Пожалуйста, введите КОД опроса.
            </Typography>
          </DialogContentText>
          <TextField
            margin="dense"
            id="name"
            label="Код опроса"
            type="text"
            fullWidth
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleDelete} color="primary" disabled={incorrect}>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="button" display="block" gutterBottom>
        удаление опроса
        </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        После удаления ОПРОСА пути назад уже не будет. Пожалуйста, будьте внимательны.
          </Typography>
      <Button variant="contained" color="secondary" onClick={deleteQuery}>
        Удалить опрос
          </Button>
    </Fragment>
  )
}

export default DeletePoll