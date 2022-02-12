import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AppsIcon from '@material-ui/icons/Apps';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import { useNavigate } from 'react-router-dom'

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    textDecoration: 'none'
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
    display: 'flex'
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  arrow: {
    color: 'white',
    textDecoration: 'none'
  }
}));

const SettingBar = ({ title, prevPage }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [appAnchorEl, setAppAnchorEl] = React.useState(null);
  const isAppMenuOpen = Boolean(appAnchorEl);

  const handleAppsMenuOpen = (event) => {
    setAppAnchorEl(event.currentTarget);
  };
  const handleAppMenuClose = () => {
    setAppAnchorEl(null);
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

  return (
    <div className={classes.grow}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={() => navigate(-1)}
          >
            <ArrowBackIcon className={classes.arrow} />
          </IconButton>
          <Typography className={classes.title} variant="h6" noWrap>
            {title}
          </Typography>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="apps"
              aria-controls={appsMenuId}
              aria-haspopup="true"
              onClick={handleAppsMenuOpen}
              color="inherit">
              <AppsIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderAppsMenu}
    </div>
  );
}

SettingBar.defaultProps = {
  prevPage: '/'
}

export default SettingBar