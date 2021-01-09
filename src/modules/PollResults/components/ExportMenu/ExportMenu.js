import React, { useState, Fragment } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

import Typography from '@material-ui/core/Typography';

import ListItemIcon from '@material-ui/core/ListItemIcon';

const ExportMenu = ({ visible, rawDataExport, byCityExport, bags }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRaw = () => {
    rawDataExport()
    setAnchorEl(null)
  }

  const handlyByCity = () => {
    byCityExport(false)
    setAnchorEl(null)
  }

  const handlyByCityOne = () => {
    byCityExport(true)
    setAnchorEl(null)
  }
  
  return (
    <Fragment>
      <Tooltip title="Выгрузить">
        <IconButton
          color="primary"
          component="span"
          onClick={handleClick}
          disabled={visible}
        >
          <PublishIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleRaw}>Общие данные</MenuItem>
        <MenuItem onClick={handlyByCityOne}>Одиним файлом</MenuItem>
        <MenuItem onClick={handlyByCity}>
          <ListItemIcon style={{ minWidth: '25px' }}>
            <Tooltip title="Кол-во уникальных городов">
              <Typography variant="button" display="block" gutterBottom>{bags.cities}</Typography>
            </Tooltip>
          </ListItemIcon>
          <Typography variant="inherit">По городам</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
export default ExportMenu