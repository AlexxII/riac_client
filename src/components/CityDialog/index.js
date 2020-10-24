import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';

export default function CityDialog({ open, handleClose, save, cities }) {
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
        <DialogTitle id="form-dialog-title">ГОРОД</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Выберите город в котором проводился опрос
          </DialogContentText>
          <Select
            fullWidth
            native
            value={state.id}
            onChange={e => handleChange(e)}
          >
            <option aria-label="None" disabled selected value="" />
            {cities.map((city, i) =>
              <option key={i} value={city.id}>{city.title}</option>
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
