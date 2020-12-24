import React from 'react'

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { useTheme } from '@material-ui/core/styles';

const ConfirmDialog = ({ open, confirm, close, data, config }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  if (!open) {
    return null
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={config.width}
      open={open}
      onClose={close}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{data.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {data.content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {config.closeBtn &&
          <Button onClick={close} color="primary">
            {config.closeBtn}
          </Button>
        }
        {config.confirmBtn &&
          <Button onClick={confirm} color="primary" autoFocus>
            {config.confirmBtn}
          </Button>
        }
      </DialogActions>
    </Dialog>
  )
}
ConfirmDialog.defaultProps = {
  config: {
    width: 'sm'
  }
}

export default ConfirmDialog