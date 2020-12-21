import React, { Fragment } from 'react'

import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import Hidden from '@material-ui/core/Hidden';

function TabPanel(props) {
  const { children, value, index, p, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="right-pannel"
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
  tabs: {
    minWidth: '160px',
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'visible'
  }
}));

const Vertical = ({ data, value, handleChange }) => {
  const classes = useStyles();
  return (
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
        <Tab label={obj.label} key={index} {...allProps({ index })} />
      ))}
    </Tabs>
  )
}

const Horizontal = ({ data, value, handleChange }) => {
  return (
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
  )
}

const AdaptiveTabs = ({ data }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (_, newValue) => {
    setValue(newValue);
  };

  return (
    <Fragment>
      <div className="root-wrap">
        <Hidden xsDown>
          <Vertical data={data} value={value} handleChange={handleChange} />
        </Hidden>
        <Hidden smUp>
          <Horizontal data={data} value={value} handleChange={handleChange} />
        </Hidden>
        {data.map((obj, index) => (
          <TabPanel value={value} key={index} index={index} p={obj.padding ? obj.padding : 1}>
            {obj.component}
          </TabPanel>
        ))}
      </div>
    </Fragment>
  )
}

export default AdaptiveTabs