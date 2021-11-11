import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';

const DriveSettingsDialog = ({ open, handleClose, save, cities, users, currentUser }) => {
  const [user, setUser] = useState(currentUser.id)
  const [city, setCity] = useState(null)

  const handleUserChange = (e) => {
    // const { options, selectedIndex, value } = e.target;
    // const title = options[selectedIndex].innerHTML
    const { value } = e.target
    setUser(value)
  }

  const handleCityChange = (e) => {
    const { value } = e.target
    setCity(value)
  }

  const handleSave = () => {
    save({
      user: users.filter(item => item.id === user)[0],
      city: cities.filter(item => item.id === city)[0]
    })
  }

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="form-dialog-title"
        maxWidth='xs'
      >
        <DialogContent>
          <DialogContentText>
            Укажите пожалуйста населенный пункт в котором проводился опрос и пользователя, который его проводил
          </DialogContentText>
          <FormControl fullWidth>
            <InputLabel shrink={true} id="cities-label" >Населенный пункт</InputLabel>
            <Select
              labelId="cities-label"
              fullWidth
              native
              label="Населенный пункт"
              id="cities-label"
              value={city?.id}
              onChange={e => handleCityChange(e)}
            >
              <option aria-label="None" disabled selected value="" />
              {cities.map((option, i) =>
                <option key={option.id} value={option.id}>{option.title}</option>
              )}
            </Select>
            <FormHelperText>Выберите населенный пункт</FormHelperText>
          </FormControl>
          <p></p>
          <FormControl fullWidth>
            <InputLabel id="users-label" style={{ color: 'black' }}>Пользователь</InputLabel>
            <Select
              fullWidth
              native
              id="users-label"
              value={user.id}
              onChange={e => handleUserChange(e)}
            >
              <option aria-label="None" disabled selected value="" />
              {users.map((option, i) =>
                <option key={option.id} value={option.id} selected={option.id === currentUser.id}>
                  {option.username}
                </option>
              )}
            </Select>
            <FormHelperText>Выберите пользователя</FormHelperText>
          </FormControl>
          <Typography variant="overline" display="block" gutterBottom>
            {`Вы: ${currentUser.username}`}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={!Boolean(user && city)} color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DriveSettingsDialog