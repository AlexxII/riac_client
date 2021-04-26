import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const AlertComponent = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Alert onClose={() => {}} severity={props.type}>
        <AlertTitle>{props.header}</AlertTitle>
        {props.text}
      </Alert>
    </div>
  );
}

AlertComponent.defaultProps = {
  type: 'warning',
  header: 'Внимание'
}

export default AlertComponent