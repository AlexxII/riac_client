import React, { Fragment, useState } from 'react';
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

const FilterDialog = (props) => {
  const { onClose, options, mainFilter, saveChanges, open, ...other } = props;
  const [filter, setFilter] = useState([])

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
    setFilter(mainFilter)
  };

  const OptionTitle = ({ title, code }) => {
    return (
      <Fragment>
        <Typography variant="subtitle1" gutterBottom>
          {code}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {title}
        </Typography>
      </Fragment>
    )
  }

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        <Typography variant="h5" gutterBottom>
          Фильтрация по опросам
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          <Link href="#" onClick={selectAll} underline="none">
            выбрать все
          </Link>
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        <FormControl required component="fieldset" >
          <FormGroup>
            {options.map((option) => (
              <Fragment>
                <FormControlLabel
                  control={<Checkbox checked={filter.includes(option.value)} onChange={() => handleChange(option.value)} />}
                  label={<OptionTitle title={option.title} code={option.value} />}
                />
                <Divider />
              </Fragment>
            ))}
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

export default FilterDialog