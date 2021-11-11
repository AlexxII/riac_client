import React, { useState } from 'react';
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

const YearsList = ({ polls }) => {
  const classes = useStyles();
  const [checked, setChecked] = useState([0]);
  const [years, setYears] = useState(false)

  useState(() => {
    const years = polls.archivePolls.reduce((acum, item) => {
      const pollYear = item.startDate.slice(-4)
      if (!acum.hasOwnProperty(pollYear)) {
        acum[pollYear] = []
      }
      acum[pollYear].push({
        id: item.id,
        count: item.resultsCount
      })
      return acum
    }, {})
    const yearsPool = []
    for (let key in years) {
      yearsPool.push({
        title: key,
        data: years[key]
      })
    }
    setYears(yearsPool)
  }, [])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  if (!years) return null

  return (
    <List className={classes.root}>
      {years.map((value) => {
        const labelId = `checkbox-list-label-${value.title}`;
        return (
          <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
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