import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Cities from './containers/Cities'
import Sample from './containers/Sample'

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      className="right-pannel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="app-setting-right-pannel">
          {children}
        </Box>
      )}
    </div>
  );
}

function allProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'visible'
  },
}));


const PollAppSettings = () => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        <Tab label="Города" {...allProps(0)} />
        <Tab label="Выборка" {...allProps(1)} />
        <Tab label="Пол" {...allProps(2)} />
        <Tab label="Возраст" {...allProps(3)} />
        <Tab label="Статус" {...allProps(4)} />
        <Tab label="ТНП" {...allProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Cities />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Sample />
      </TabPanel>
      <TabPanel value={value} index={2}>
        ПОЛ
      </TabPanel>
      <TabPanel value={value} index={3}>
        Возраст
      </TabPanel>
      <TabPanel value={value} index={4}>
        Статус
      </TabPanel>
      <TabPanel value={value} index={5}>
        ТНП
      </TabPanel>
    </div>
  );
}

export default PollAppSettings