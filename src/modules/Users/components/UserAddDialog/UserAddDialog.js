import React, { Fragment } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

const UserAddDialog = () => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <Dialog open={true} onClose={handleClose} aria-labelledby="form-dialog-title">
        <form>
          <DialogTitle>Добавление пользователя</DialogTitle>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пользователь"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Логин"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Пароль"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  required
                  fullWidth="true"
                  label="Повтор пароля"
                  type="password"
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required variant="outlined" fullWidth="true">
                  <InputLabel htmlFor="outlined-age-native-simple">Статус</InputLabel>
                  <Select
                    required
                    native
                    label="Статус"
                    inputProps={{
                      name: 'age',
                      id: 'outlined-age-native-simple',
                    }}
                  >
                    <option aria-label="None" selected disabled="true" value="" />
                    <option value={10}>Военнослужащий</option>
                    <option value={20}>Гражданский служащий</option>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl required variant="outlined" fullWidth="true">
                  <InputLabel htmlFor="outlined-age-native-simple">Права</InputLabel>
                  <Select
                    native
                    label="Права"
                    inputProps={{
                      name: 'age',
                      id: 'outlined-age-native-simple',
                    }}
                  >
                    <option aria-label="None" selected disabled="true" value="" />
                    <option value={10}>Адмнистратор</option>
                    <option value={20}>Оператор</option>
                    <option value={30}>Пользователь</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Отмена
          </Button>
            <Button type="submit" onClick={handleClose} color="primary">
              Добавить
          </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
}

export default UserAddDialog