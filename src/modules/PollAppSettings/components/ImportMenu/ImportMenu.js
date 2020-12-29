import React, { useState, Fragment } from 'react';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

const ImportMenu = ({ disabled, addOneCity, addCitites }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCityAdd = () => {
    addOneCity()
    setAnchorEl(null)
  }

  const handlyCititiesAdd = () => {
    addCitites()
    setAnchorEl(null)
  }

  return (
    <Fragment>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={handleClick}
        disabled={disabled}
      >
        Добавить
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleCityAdd}>
          <Typography variant="inherit">Населенный пункт</Typography>
        </MenuItem>
        <MenuItem onClick={handlyCititiesAdd}>
          <Typography variant="inherit">Несколько населенных пунктов</Typography>
        </MenuItem>
      </Menu>
    </Fragment>
  );
}
export default ImportMenu