import React from 'react'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const ConfirmDialog = ({ open, confirm, close, data, buttons }) => {
  return (
    <Dialog
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{data.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {data.text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {buttons.close &&
          <Button onClick={close} color="primary">
            {buttons.close}
          </Button>
        }
        {buttons.confirm &&
          <Button onClick={confirm} color="primary" autoFocus>
            {buttons.confirm}
          </Button>
        }
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog