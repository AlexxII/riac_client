import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));
  
const YearsList = ({years, checked, handleToggle}) => {
  const classes = useStyles();

  if (!years) return null

  return (
    <List className={classes.root}>
      {years.map((value, index) => {
        const labelId = `checkbox-list-label-${value.title}`;
        return (
          <ListItem key={index} role={undefined} dense button onClick={handleToggle(value)}>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.indexOf(value) !== -1}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': labelId }}
              />
            </ListItemIcon>
            <ListItemText id={labelId} primary={`${value.title} год`} />
            <ListItemSecondaryAction>
              {value.data.length}/
              {value.data.reduce((acum, item) => {
                acum += item.count
                return acum
              }, 0)}
            </ListItemSecondaryAction>
          </ListItem>
        );
      })}
    </List>
  );
}

export default YearsList