import React, { Fragment, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';

const useStyles = makeStyles((theme) => ({
  speedDial: {
    position: 'fixed',
    bottom: '30px',
    right: '30px'
  },
}));

const SpeedDialFab = ({ actions }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      <SpeedDial
        ariaLabel="SpeedDial openIcon"
        className={classes.speedDial}
        icon={<SpeedDialIcon />}
        // icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        onClose={handleClose}
        onMouseLeave={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            onClick={action.click}
            tooltipTitle={action.name}
          />
        ))}
      </SpeedDial>
    </Fragment>
  );
}
export default SpeedDialFab