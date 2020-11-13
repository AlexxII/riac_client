import React, { Fragment, useState } from 'react'

import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Badge from '@material-ui/core/Badge';
import Tooltip from '@material-ui/core/Tooltip';

import { gql, useApolloClient } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { LOGOUT_MUTATION } from './mutations'
import { CURRENT_USER_QUERY } from '../../containers/App/queries'

const UserProfile = ({ close }) => {
  const client = useApolloClient();
  const { currentUser } = client.readQuery({
    query: gql`
    query {
      currentUser {
        id
        username
      }
    }
    `,
  })
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
          <Tooltip
            title={currentUser.username}
          >
            <AccountCircle />
          </Tooltip>
        </Badge>
      </IconButton>
      { renderMenu}
    </Fragment>
  )
}

export default UserProfile