import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
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

function a11yProps(index) {
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
        <Tab label="Общие" {...a11yProps(0)} />
        <Tab label="По Н.П." {...a11yProps(1)} />
        <Tab label="Линейка" {...a11yProps(2)} />
        <Tab label="Сравнения" {...a11yProps(3)} />
        <Tab label="Графики" {...a11yProps(4)} />
        <Tab label="Пакетный" {...a11yProps(5)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Результаты опроса ID - {id}
      </TabPanel>
      <TabPanel value={value} index={1}>
        Распределение по населенным пунктам
      </TabPanel>
      <TabPanel value={value} index={2}>
        Линейное распределение ответов
      </TabPanel>
      <TabPanel value={value} index={3}>
        Сравнения с аналогичными опросами
      </TabPanel>
      <TabPanel value={value} index={4}>
        Графики
      </TabPanel>
      <TabPanel value={value} index={5}>
        Пакетный ВВод данных
      </TabPanel>
    </div>
  );
}

export default PollResults