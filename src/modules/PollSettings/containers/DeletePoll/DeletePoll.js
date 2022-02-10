import React, { Fragment, useState, useContext } from 'react'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';

import { SysnotyContext } from '../../../../containers/App/notycontext'

import { useMutation } from '@apollo/client'
import { useNavigate} from "react-router-dom";

import { DELETE_POLL } from './mutations'

const DeletePoll = ({ id, code }) => {
  const navigator = useNavigate();
  const [setNoti] = useContext(SysnotyContext);
  const [open, setOpen] = useState(false)
  const [incorrect, setIncorrect] = useState(true)
  const [delPoll, { poll }] = useMutation(DELETE_POLL, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Удалить не удалось. Смотрите консоль.'
      })
      console.log(e)
      setOpen(false)
    },
    update: (cache, { data }) => {
      const poll = data.deletePoll
      cache.evict({ id: cache.identify(poll) })
      cache.gc()
    },
    onCompleted: () => {
      navigator.goBack()
      setNoti({
        type: 'success',
        text: 'Успех. Опрос удален.'
      })
    }
  })

  const handleClose = () => {
    setOpen(false);
  };

  const handlePollDel = (id) => {
    delPoll({
      variables: {
        id
      }
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
              Оно приведет к безвозвратному удалению ВСЕХ данных по этому опросу.
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
      <div style={{ textAlign: 'left' }}>
        <div className="category-service-zone">
          <Typography variant="h5" gutterBottom className="header">Удаление опроса</Typography>
        </div>
        <Divider />
        <div className="info-zone">
          <Typography variant="body2" gutterBottom>
            Удаление всех данных. После удаления ОПРОСА пути назад уже не будет. Пожалуйста, будьте внимательны.
          </Typography>
        </div>
        <Button variant="contained" color="secondary" onClick={deleteQuery}>
          Удалить опрос
        </Button>
      </div>
    </Fragment>
  )
}

export default DeletePoll