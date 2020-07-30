import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Hidden from '@material-ui/core/Hidden';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '10px',
    left: '-55px'
  },
  small: {
    position: 'fixed',
    bottom: '30px',
    right: '30px'
  }
}));

const AddFub = ({ onClick }) => {
  const classes = useStyles();

  return (
    <div className={classes.small}>
      <Fab color="secondary" aria-label="add" onClick={onClick}>
        <AddIcon />
      </Fab>
    </div>
  );
}
export default AddFub