import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(({
  root: {
    display: 'flex'
  },
  avatar: {
    backgroundColor: props => props.color
  }
}));

const PassiveAvatar = (props) => {
  const classes = useStyles(props);
  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        {props.liter}
      </Avatar>
    </div>
  );
}

export default PassiveAvatar