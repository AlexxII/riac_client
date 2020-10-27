import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const FinishDialog = ({ open, handleClose, finishAll, confirm }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Данная анкета завершена."}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Кажется данная анкета закончена. Перейти к другой анкете?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Отмена
          </Button>
          <Button onClick={finishAll} color="primary">
            Закончить
          </Button>
          <Button onClick={confirm} color="primary" autoFocus>
            Следующая
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default FinishDialog