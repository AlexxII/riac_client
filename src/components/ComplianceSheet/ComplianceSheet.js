import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 660,
    backgroundColor: theme.palette.background.paper,
  }
}));

export default function CheckboxList({ data, saveData }) {
  const theme = useTheme();
  const classes = useStyles();
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggle = (id) => () => {
    const newData = data.map(obj => obj.id === id ? {
      ...obj, active: !obj.active
    } : obj)
    saveData(newData)
  };

  const handleBlur = (e, id) => {
    const code = e.currentTarget.value
    const newData = data.map(obj => obj.id === id ? {
      ...obj, code: code
    } : obj)
    saveData(newData)
  }

  return (
    <List className={classes.root}>
      {data.map((value) => {
        const labelId = `checkbox-list-label-${value}`;
        return (
          <ListItem key={value.id} role={undefined} dense button onClick={handleToggle(value.id)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={value.active}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <Grid item container >
              <Grid xs="9" alignItems="center" container>
                <ListItemText id={labelId} primary={`${value.title}`} />
              </Grid>
              <Grid xs="3">
                <TextField label={smallScreen ? "" : "Код опроса"} defaultValue={value.code ? value.code : null} onBlur={(e) => handleBlur(e, value.id)} />
              </Grid>
            </Grid>
          </ListItem>
        );
      })}
    </List>
  );
}
