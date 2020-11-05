import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import PieChartIcon from '@material-ui/icons/PieChart';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import { NavLink } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip';

import ServeiceMenu from '../ServiceMenu'
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from '../../containers/App/queries'
import { GET_USER_INFO } from './queries';
import { LOGOUT_MUTATION } from './mutations'

// ЧЕРЕЗ Композицию

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
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [appAnchorEl, setAppAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false)

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
    onCompleted: (data) => console.log(data)
  });

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const isAppMenuOpen = Boolean(appAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAppsMenuOpen = (event) => {
    setAppAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleProfileExit = () => {
    logout()
    handleMenuClose()
  }

  const handleAppMenuClose = () => {
    setAppAnchorEl(null);
    handleMobileMenuClose();
  }

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const openServiceMenu = (e) => {
    setMenuOpen(true)
  }

  const closeServiceMenu = (e) => {
    setMenuOpen(false)
  }

  const menuId = 'primary-account-menu';
  const appsMenuId = 'primary-apps-menu';

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
      <NavLink to="analyze">
        <MenuItem>
          <IconButton color="inherit">
            <Badge badgeContent={0} color="secondary">
              <PieChartIcon />
            </Badge>
          </IconButton>
          <p>XML</p>
        </MenuItem>
      </NavLink>
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
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
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
            <NavLink to="tester">
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <AlarmOnIcon className={classes.link} />
                </Badge>
              </IconButton>
            </NavLink>
            <NavLink to="analyze">
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <PieChartIcon className={classes.link} />
                </Badge>
              </IconButton>
            </NavLink>
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
      <ServeiceMenu open={menuOpen} close={closeServiceMenu}/>
      {renderMobileMenu}
      {renderMenu}
      {renderAppsMenu}
    </div>
  );
}

export default HomeBar