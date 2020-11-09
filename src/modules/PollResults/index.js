import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Generation from './containers/Generation'
import OverallResults from './containers/OverallResults'

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
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        className={classes.tabs}
      >
        <Tab label="Общие" {...allProps(0)} />
        <Tab label="По Н.П." {...allProps(1)} />
        <Tab label="Линейка" {...allProps(2)} />
        <Tab label="Графики" {...allProps(3)} />
        <Tab label="Пакетный" {...allProps(4)} />
        <Tab label="Тестирование" {...allProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <OverallResults id={id} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Распределение по населенным пунктам
      </TabPanel>
      <TabPanel value={value} index={2}>
        Линейное распределение ответов
      </TabPanel>
      <TabPanel value={value} index={3}>
        Графики
      </TabPanel>
      <TabPanel value={value} index={4}>
        Пакетный ВВод данных
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Generation id={id} />
      </TabPanel>

    </div>
  );
}

export default PollResults