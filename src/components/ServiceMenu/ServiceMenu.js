import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SettingsIcon from '@material-ui/icons/Settings';
import PhoneIcon from '@material-ui/icons/Phone';
import Typography from '@material-ui/core/Typography';
import GroupIcon from '@material-ui/icons/Group';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import PieChartIcon from '@material-ui/icons/PieChart';

import { NavLink } from 'react-router-dom'

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function ServiceMenu({ open, close }) {
  const classes = useStyles();
  const list = () => (
    <div
      className={clsx(classes.list)}
      role="presentation"
      onClick={close}
      onKeyDown={close}
    >
      <List>
        <Typography variant="overline" style={{ fontSize: '10px' }}>
          подсистема опросов
        </Typography>
        <NavLink to='analyze'>
          <ListItem button key={1}>
            <ListItemIcon><PieChartIcon /></ListItemIcon>
            <ListItemText primary="Анализатор" />
          </ListItem>
        </NavLink>
        {/* <NavLink to='tester'>
          <ListItem button key={1}>
            <ListItemIcon><AlarmOnIcon /></ListItemIcon>
            <ListItemText primary="Тест интерфейса" />
          </ListItem>
        </NavLink> */}
        <ListItem button key={1}>
          <ListItemIcon><PhoneIcon /></ListItemIcon>
          <ListItemText primary="Генератор номеров" />
        </ListItem>
        <NavLink to='poll-app-settings'>
          <ListItem button key={1}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Настройки" />
          </ListItem>
        </NavLink>
        <Typography variant="overline" style={{ fontSize: '10px' }}>
          общие
        </Typography>
        <Divider />
        <NavLink to='settings/users'>
          <ListItem button key={1}>
            <ListItemIcon><GroupIcon /></ListItemIcon>
            <ListItemText primary="Пользователи" />
          </ListItem>
        </NavLink>
      </List>
    </div>
  );

  return (
    <Drawer anchor={'left'} open={open} onClose={close} className="left-app-menu">
      {list('left')}
    </Drawer>
  );
}
