import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import Generation from './containers/Generation'
import OverallResults from './containers/OverallResults'
import LinearDistibution from './containers/LinearDistribution'
import BatchInput from './containers/BatchInput'

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      className="right-pannel"
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box className="result-right-pannel">
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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
    minWidth: '160px',
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

const PollResults = ({ id }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      {/* <div display={'none'}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          <Tab label="Item One" {...allProps(0)} />
          <Tab label="Item Two" {...allProps(1)} />
          <Tab label="Item Three" {...allProps(2)} />
          <Tab label="Item Four" {...allProps(3)} />
          <Tab label="Item Five" {...allProps(4)} />
          <Tab label="Item Six" {...allProps(5)} />
          <Tab label="Item Seven" {...allProps(6)} />
        </Tabs>
      </div> */}

      <span display={{ xs: 'none', sm: 'block' }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
        >
          <Tab label="Общие" {...allProps(0)} />
          <Tab label="Линейка" {...allProps(1)} />
          <Tab label="Пакетный" {...allProps(2)} />
          <Tab label="Тестирование" {...allProps(3)} />
        </Tabs>
      </span>
      <TabPanel value={value} index={0}>
        <OverallResults id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <LinearDistibution id={id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <BatchInput id={id} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Generation id={id} />
      </TabPanel>

    </div>
  );
}

export default PollResults