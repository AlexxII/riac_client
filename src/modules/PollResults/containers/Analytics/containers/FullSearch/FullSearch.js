import React, { Fragment, useState, useEffect } from 'react';

import Fuse from 'fuse.js'

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import DialogContentText from '@material-ui/core/DialogContentText';


const FullSearch = (props) => {
  const { onClose, options, mainFilter, saveChanges, question, open, ...other } = props;
  const [filter, setFilter] = useState([])

  const fuseOptions = {
    includeScore: true,
    keys: ['title']
  }
  const fuse = new Fuse(mainFilter, fuseOptions)

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    saveChanges(filter)
  };

  const handleReset = () => {
    setFilter([])
  }

  const handleChange = (value) => {
    // определить положение чекбокса до изменения
    const state = filter.includes(value)
    if (!state) {
      setFilter([
        ...filter,
        value
      ])
    } else {
      setFilter(prevState => (
        prevState.filter(item => item !== value)
      ))
    }
  };

  const selectAll = () => {
    setFilter(options.map(item => item.value))
  }

  const handleEntering = () => {
    console.log(mainFilter);
  };

  const handleInputSearch = (e) => {
    if (e.currentTarget.value.length > 4) {
      setFilter(fuse.search(e.currentTarget.value))
    }
  }

  const OptionTitle = ({ title, poll }) => {
    return (
      <Fragment>
        <Typography variant="subtitle1" gutterBottom>
          {title}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {poll.code} - {poll.title}
        </Typography>
      </Fragment>
    )
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="md"
      minWidth="md"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Typography variant="h5" gutterBottom>
          Поиск по наименованию
        </Typography>
      </DialogTitle>
      <DialogContentText style={{ padding: '0 23px 0 23px' }}>
        <TextField
          style={{ marginTop: '-10px', paddingBottom: '10px' }}
          autoFocus
          fullWidth
          margin="dense"
          id="name"
          label="Найти"
          type="email"
          onChange={handleInputSearch}
        />
        <Typography variant="caption" display="block" gutterBottom>
          <Link href="#" onClick={selectAll} underline="none">
            выбрать все
          </Link>
        </Typography>

      </DialogContentText>
      <DialogContent dividers>
        <FormControl required component="fieldset" >
          <FormGroup>
            {filter.length ?
              filter.map((option, index) => {
                if (index < 10) {
                  return (
                    <Fragment key={option.item.id}>
                      <FormControlLabel
                        control={<Checkbox checked={filter.includes(option.item.id)} onChange={() => handleChange(option.item.id)} />}
                        label={<OptionTitle title={option.item.title} poll={option.item.poll} />}
                      />
                      <Divider />
                    </Fragment>
                  )
                }
              })
              :
              <p>Начните поиск</p>
            }
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleReset} color="primary">
          Сбросить
        </Button>
        <Button onClick={handleCancel} color="primary">
          Отмена
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog >
  );
}

export default FullSearch