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

const UserUpdateDialog = ({ data, selects, open, close, updateUser }) => {
  const [userData, setUserData] = useState(false)

  const save = (e) => {
    e.preventDefault()
    updateUser({
      id: data.id,
      data: userData
    })
    setUserData(false)
    close()
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
        <form onSubmit={save}>
          <DialogTitle>Обновить данные</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пользователь"
                  variant="outlined"
                  defaultValue={data.username}
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
                  defaultValue={data.login}
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
                <FormControl required variant="outlined" fullWidth="true">
                  <InputLabel htmlFor="outlined-age-native-simple">Статус</InputLabel>
                  <Select
                    required
                    native
                    defaultValue={data.status ? data.status.id : ''}
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
                    defaultValue={data.rights ? data.rights.id : ''}
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
              Обновить
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

export default UserUpdateDialog