import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Badge from '@material-ui/core/Badge';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';

import UserProfileMenu from '../../containers/UserProfileMenu'
import ServiceMenu from '../ServiceMenu'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('xs')]: {
      display: 'block',
    },
  },
  inputRoot: {
    color: 'inherit',
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  }
}));

const HomeBar = ({ title }) => {
  const classes = useStyles();
  const [appAnchorEl, setAppAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false)
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isAppMenuOpen = Boolean(appAnchorEl);

  const handleAppsMenuOpen = (event) => {
    setAppAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };


  const handleAppMenuClose = () => {
    setAppAnchorEl(null);
    handleMobileMenuClose();
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const openServiceMenu = () => {
    setMenuOpen(true)
  }

  const closeServiceMenu = () => {
    setMenuOpen(false)
  }

  const appsMenuId = 'primary-apps-menu';

  const renderAppsMenu = (
    <Menu
      anchorEl={appAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={appsMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isAppMenuOpen}
      onClose={handleAppMenuClose}
    >
      <MenuItem onClick={handleAppMenuClose}>ПУСТО_1</MenuItem>
      <MenuItem onClick={handleAppMenuClose}>ПУСТО_2</MenuItem>
    </Menu>
  )

  const mobileMenuId = 'primary-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={0} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Уведомления</p>
      </MenuItem>
      <MenuItem onClick={handleAppsMenuOpen}>
        <IconButton
          aria-label="more apps"
          aria-controls="primary-apps-menu"
          aria-haspopup="true"
          color="inherit">
          <AppsIcon />
        </IconButton>
        <p>Приложения</p>
      </MenuItem>
      <MenuItem>
        <UserProfileMenu />
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            onClick={openServiceMenu}
            aria-label="open drawer"
          >
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              aria-label="apps"
              aria-controls={appsMenuId}
              aria-haspopup="true"
              onClick={handleAppsMenuOpen}
              color="inherit">
              <Badge badgeContent={0} color="secondary">
                <AppsIcon />
              </Badge>
            </IconButton>
            <UserProfileMenu />
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <ServiceMenu open={menuOpen} close={closeServiceMenu} />
      {renderMobileMenu}
      {renderAppsMenu}
    </div>
  );
}

export default HomeBar