import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';

const DialogWithSelect = ({ open, handleClose, save, header, text, options }) => {
  const [state, setState] = useState("")
  const handleChange = (e) => {
    const { options, selectedIndex, value } = e.target;
    const id = value
    const title = options[selectedIndex].innerHTML
    setState({
      id,
      title
    })
  }

  const handleSave = () => {
    save(state)
  }

  return (
    <div>
      <Dialog open={open} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{header}</DialogTitle>
        <DialogContent>
          <DialogContentText>
           {text}
          </DialogContentText>
          <Select
            fullWidth
            native
            value={state.id}
            onChange={e => handleChange(e)}
          >
            <option aria-label="None" disabled selected value="" />
            {options.map((option, i) =>
              <option key={option.id} value={option.id}>{option.title}</option>
            )}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!Boolean(state)} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DialogWithSelect