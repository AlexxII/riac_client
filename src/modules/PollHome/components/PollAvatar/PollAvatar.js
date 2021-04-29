import React from 'react';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: '-1px',
      left: '-1px',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: '$ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}))(Badge);

const useStyles = makeStyles(({
  root: {
    display: 'flex'
  },
  avatar: {
    backgroundColor: data => data.color
  }
}));

const ActiveAvatar = ({ data }) => {
  const classes = useStyles(data);
  if (data.active) {
    return (
      <div className={classes.root}>
        <StyledBadge
          overlap="circle"
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          variant="dot"
        >
          <Avatar className={classes.avatar}>
            <span className="poll-liter-title">{data.liter}</span>
          </Avatar>
        </StyledBadge>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar}>
        <span className="poll-liter-title">{data.liter}</span>
      </Avatar>
    </div>
  )
}

export default ActiveAvatar