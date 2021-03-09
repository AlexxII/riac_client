import React, { useState, Fragment } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';

const StatusMenu = ({ visible, handleStatus }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSetStatus = () => {
    handleStatus('set')
    setAnchorEl(null)
  }

  const handleUnsetStatus = () => {
    handleStatus('unset')
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Tooltip title="Изменить статус">
        <IconButton
          color="primary"
          component="span"
          onClick={handleClick}
          disabled={visible}
        >
          <CheckCircleOutlineOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSetStatus}>Обработан</MenuItem>
        <MenuItem onClick={handleUnsetStatus}>Не обработан</MenuItem>
      </Menu>
    </Fragment>
  );
}
export default StatusMenu