import React, { useState, Fragment } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import ListAltIcon from '@material-ui/icons/ListAlt';
import CheckCircleOutlineOutlinedIcon from '@material-ui/icons/CheckCircleOutlineOutlined';
import { assertNullableType } from 'graphql';

const EditMenu = ({ visible, handleStatus, handleCityChange, handleUserChange }) => {
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

  const handleCityChangeEx = () => {
    handleCityChange()
    setAnchorEl(null)
  }

  const handleUserChangeEx = () => {
    handleUserChange()
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Tooltip title="Изменить">
        <IconButton
          color="primary"
          component="span"
          onClick={handleClick}
          disabled={visible}
        >
          <ListAltIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <Typography
          className="menu-subtext"
          color="textSecondary"
          display="block"
          variant="caption"
        >
          Статус
        </Typography>

        <MenuItem onClick={handleSetStatus}>Обработан</MenuItem>
        <MenuItem onClick={handleUnsetStatus}>Не обработан</MenuItem>
        <Divider style={{ marginTop: '5px' }} />
        <Typography
          className="menu-subtext"
          color="textSecondary"
          display="block"
          variant="caption"
        >
          Город
        </Typography>
        <MenuItem onClick={handleCityChangeEx}>Изменить</MenuItem>
        <Typography
          className="menu-subtext"
          color="textSecondary"
          display="block"
          variant="caption"
        >
          Интервьюер
        </Typography>
        <MenuItem onClick={handleUserChangeEx}>Изменить</MenuItem>
      </Menu>
    </Fragment>
  );
}
export default EditMenu