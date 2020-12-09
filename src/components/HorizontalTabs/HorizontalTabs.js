import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles';

function TabPanel(props) {
  const { children, value, index, p, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
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
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

const HorizontalTabs = ({ data }) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          variant="scrollable"
          value={value}
          onChange={handleChange}
          scrollButtons="auto"
          aria-label="horizontal auto tabs"
        >
          {data.map((obj, index) => (
            <Tab label={obj.label} {...allProps({ index })} />
          ))}
        </Tabs>
      </AppBar>
      {data.map((obj, index) => (
        <TabPanel value={value} index={index} p={obj.padding ? obj.padding : 1}>
          {obj.component}
        </TabPanel>
      ))}
    </div>
  );
}

export default HorizontalTabs