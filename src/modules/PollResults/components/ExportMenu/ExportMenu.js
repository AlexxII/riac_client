import React, { useState, Fragment } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import PublishIcon from '@material-ui/icons/Publish';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';


const ExportMenu = ({ visible, rawDataExport, byCityExport, byIntervExport }) => {
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
    byCityExport()
    setAnchorEl(null)
  }

  const handleByInterv = () => {
    byIntervExport()
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Tooltip title="Выгрузить">
        <IconButton
          color="primary"
          component="span"
          onClick={handleClick}
          // onClick={() => setExportMenuOpen(true)}
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
        <MenuItem onClick={handlyByCity}>По городам</MenuItem>
        <MenuItem onClick={handleByInterv}>С шапкой</MenuItem>
      </Menu>
    </Fragment>
  );
}
export default ExportMenu