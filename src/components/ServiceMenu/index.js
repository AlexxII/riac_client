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
        <ListItem button key={1}>
          <ListItemIcon><PhoneIcon /></ListItemIcon>
          <ListItemText primary="Генератор номеров" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key={1}>
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Настройки" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Drawer anchor={'left'} open={open} onClose={close}>
      {list('left')}
    </Drawer>
  );
}
