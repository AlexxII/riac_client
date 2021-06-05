import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import RadioGroup from '@material-ui/core/RadioGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';


const FilterDialog = (props) => {
  const { onClose, options, open, ...other } = props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = () => {
    // onClose(value);
  };

  const handleChange = (event) => {
    console.log(event);
    // setValue(event.target.value);
  };

  const handleEntering = () => {
    // if (radioGroupRef.current != null) {
    //   radioGroupRef.current.focus();
    // }
  };

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Phone Ringtone</DialogTitle>
      <DialogContent dividers>
        <FormControl required component="fieldset" >
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                control={<Checkbox checked={false} onChange={() => handleChange(option.value)} />}
                // label={option.title}
                label={<p style={{fontSize: '8px'}}>{option.title}</p>}
              />
            ))}
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default FilterDialog