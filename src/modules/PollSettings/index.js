import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import CommonSetting from './components/Common'
import ConfigEditor from './components/ConfigEditor'
import ReoderEditor from './components/ReoderEditor';
import DeletePoll from './components/DeletePoll'

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
        <Box p={3}>
          <Typography>{children}</Typography>
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
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'visible'
  },
}));


const PollSettings = ({ id, code }) => {
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
        <Tab label="Общие" {...allProps(0)} />
        <Tab label="Порядок отображения" {...allProps(1)} />
        <Tab label="Конфиг" {...allProps(2)} />
        <Tab label="Удаление" {...allProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <CommonSetting id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReoderEditor id={id} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ConfigEditor id={id} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <DeletePoll id={id} code={code} />
      </TabPanel>
    </div>
  );
}

export default PollSettings