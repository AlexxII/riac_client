import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

function TabPanel(props) {
  const { children, value, index, p, ...other } = props;
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
        <Box p={p}>
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
    minWidth: '160px',
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'visible'
  },
}));

const VerticalTabs = ({ data }) => {
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
        aria-label="Vertical tabs"
        scrollButtons="auto"
        className={classes.tabs}
      >
        {data.map((obj, index) => (
          <Tab label={obj.label} {...allProps({ index })} />
        ))}
      </Tabs>
      {data.map((obj, index) => (
        <TabPanel value={value} index={index} p={obj.padding ? obj.padding : 1}>
          {obj.component}
        </TabPanel>
      ))}
    </div>
  );
}

export default VerticalTabs