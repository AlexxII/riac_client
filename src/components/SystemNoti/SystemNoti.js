import React from 'react'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

const SystemNoti = (props) => {

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Snackbar open={props.open} autoHideDuration={props.duration} onClose={props.close}>
      <Alert severity={props.type} onClose={props.close}>
        {props.text}
      </Alert>
    </Snackbar>

  )
}

SystemNoti.defaultProps = {
  type: 'error',
  duration: 4000
}

export default SystemNoti