import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const UserAddDialog = ({ open, close, saveNewUser, selects }) => {
  const [userData, setUserData] = useState()

  const save = (e) => {
    e.preventDefault()
    saveNewUser(userData)
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
        <form onSubmit={save}>
          <DialogTitle>Добавление пользователя</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пользователь"
                  variant="outlined"
                  onChange={(e) => setUserData(
                    {
                      ...userData,
                      username: e.currentTarget.value
                    }
                  )}
                  helperText="Используйте формат: Иванов И.И."
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Логин"
                  variant="outlined"
                  onChange={(e) => setUserData(
                    {
                      ...userData,
                      login: e.currentTarget.value
                    }
                  )}
                  helperText="Используйте формат: IvanovII"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пароль"
                  type="password"
                  variant="outlined"
                  onChange={(e) => setUserData(
                    {
                      ...userData,
                      password: e.currentTarget.value
                    }
                  )}
                  helperText="Не менее восьми символов"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пароль"
                  type="password"
                  variant="outlined"
                  helperText="Повторите пароль"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required variant="outlined" fullWidth="true">
                  <InputLabel htmlFor="outlined-age-native-simple">Статус</InputLabel>
                  <Select
                    required
                    native
                    label="Статус"
                    onChange={(e) => setUserData(
                      {
                        ...userData,
                        status: e.currentTarget.value
                      }
                    )}
                    inputProps={{
                      name: 'age',
                      id: 'outlined-age-native-simple',
                    }}
                  >
                    <option aria-label="None" selected disabled="true" value="" />
                    {selects.userStatus.map(obj => <option value={obj.id}>{obj.title}</option>)}
                  </Select>
                  <FormHelperText>Укажите социальный статус</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required variant="outlined" fullWidth="true">
                  <InputLabel htmlFor="outlined-age-native-simple">Права</InputLabel>
                  <Select
                    native
                    label="Права"
                    onChange={(e) => setUserData(
                      {
                        ...userData,
                        rights: e.currentTarget.value
                      }
                    )}
                    inputProps={{
                      name: 'age',
                      id: 'outlined-age-native-simple',
                    }}
                  >
                    <option aria-label="None" selected disabled="true" value="" />
                    {selects.userRights.map(obj => <option value={obj.id}>{obj.title}</option>)}
                  </Select>
                  <FormHelperText>Укажите права поьзователя</FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <p></p>
          <DialogActions>
            <Button variant="contained" onClick={close}>
              Отмена
          </Button>
            <Button variant="contained" type="submit" color="primary">
              Добавить
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

export default UserAddDialog