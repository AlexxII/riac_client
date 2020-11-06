import React, { Fragment, useState } from 'react'

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_USER_INFO } from './queries';
import { LOGOUT_MUTATION } from './mutations'
import { CURRENT_USER_QUERY } from '../../containers/App/queries'


const UserProfile = ({ close }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [logout] = useMutation(
    LOGOUT_MUTATION,
    {
      update: (cache) => cache.writeQuery({
        query: CURRENT_USER_QUERY,
        data: { currentUser: null },
      }),
    },
  );
  const { loading, error, user } = useQuery(GET_USER_INFO, {
    onCompleted: (user) => console.log(user)
  });

  const menuId = 'account-menu';

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileExit = () => {
    logout()
    handleMenuClose()
  }

  const handleProfileMenuOpen = (e) => {
    setAnchorEl(e.currentTarget)
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {/* <MenuItem onClick={handleMenuClose}>Профиль</MenuItem> */}
      <MenuItem onClick={handleProfileExit}>Выход</MenuItem>
    </Menu>
  );


  return (
    <Fragment>
      <IconButton
        edge="end"
        aria-label="account of current user"
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={handleProfileMenuOpen}
        color="inherit"
      >
        <Badge badgeContent={0} color="secondary">
          <Tooltip title=
            {!!user ?
              user.currentUser.userName
              :
              ''
            }>
            <AccountCircle />
          </Tooltip>
        </Badge>
      </IconButton>
      { renderMenu}
    </Fragment>
  )
}

export default UserProfile