import React, { Fragment, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';

const PassResetDialog = ({ data, open, close, passReset }) => {
  const [userData, setUserData] = useState(false)

  const save = (e) => {
    e.preventDefault()
    passReset({
      id: data.id,
      password: userData.password
    })
    setUserData(false)
    close()
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={close} aria-labelledby="form-dialog-title">
        <form onSubmit={save}>
          <DialogTitle>Установка пароля</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Установите новый пароль пользователя - {data.username}
            </DialogContentText>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пароль"
                  type="password"
                  variant="outlined"
                  helperText="Повторите пароль"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <p></p>
          <DialogActions>
            <Button variant="contained" onClick={close}>
              Отмена
          </Button>
            <Button variant="contained" type="submit" color="primary">
              Сохранить
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

export default PassResetDialog