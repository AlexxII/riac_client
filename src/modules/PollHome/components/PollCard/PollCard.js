import React, { Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom'
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PollIcon from '@material-ui/icons/Poll';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import ActiveAvatar from '../ActiveAvatar'
import PassiveAvatar from '../PassiveAvatar'
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SettingsIcon from '@material-ui/icons/Settings';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

import { pollWays } from '../../lib/constants'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
    margin: '10px 0'
  },
  header: {
    padding: '16px 16px 0 16px'
  },
  content: {
    flex: 1,
    padding: '10px 16px 0 16px'
  },
  media: {
    height: 0,
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  }
}));

const PollCard = ({ data }) => {
  const classes = useStyles();
  const Avatar = () => {
    if (data.active) {
      return (
        <ActiveAvatar type={data.type} color={data.color}>
          {data.type}
        </ActiveAvatar>
      )
    } else {
      return (
        <PassiveAvatar type={data.type} color={data.color}>
          {data.type}
        </PassiveAvatar>
      )
    }
  }

  const Results = () => {
    return (
      <Tooltip title="Результаты">
        <NavLink to={`/results/${data.id}/${data.code}`}>
          <IconButton>
            <PollIcon />
          </IconButton>
        </NavLink>
      </Tooltip>
    )
  }
  const Drive = () => {
    return (
      <Tooltip title="Ввод результатов">
        <NavLink to={`/drive/${data.id}/${data.code}`}>
          <IconButton >
            <AssignmentTurnedInIcon />
          </IconButton>
        </NavLink>
      </Tooltip>
    )
  }
  const Attachment = () => {
    return (
      <Tooltip title="Файлы">
        <NavLink to={`/attachment/${data.id}/${data.code}`}>
          <IconButton>
            <AttachFileIcon />
          </IconButton>
        </NavLink>
      </Tooltip>
    )
  }
  const Settings = () => {
    return (
      <Tooltip title="Настройки опроса">
        <NavLink to={`/poll-settings/${data.id}/${data.code}`}>
          <IconButton>
            <SettingsIcon />
          </IconButton>
        </NavLink>
      </Tooltip>
    )
  }
  const Wiki = () => {
    return (
      <Tooltip title="Заметки">
        <NavLink to={`/poll-wiki/${data.id}/${data.code}`}>
          <IconButton>
            <LibraryBooksIcon />
          </IconButton>
        </NavLink>
      </Tooltip>
    )
  }

  return (
    <Fragment>
      <Card className={classes.root}>
        <CardHeader className={classes.header}
          avatar={
            <Avatar />
          }
          action={
            <Settings />
          }
          title={data.code + ': ' + data.title}
          subheader={data.startDate + ' - ' + data.endDate}
        />
        <CardContent className={classes.content}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={6}>
              <Typography variant="button" display="block" gutterBottom>
                Метод проведения: {pollWays[data.way]}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="button" display="block" gutterBottom>
                Респондентов: {data.sample}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions disableSpacing>
          <Grid container item xs={12}>
            <Results />
            {data.cities.length ?
              <Drive /> :
              <Tooltip title="Города устанавливаются в настройках опроса">
                <Typography variant="overline" display="block" gutterBottom className="empty-cities-warning">
                  настройте города
              </Typography>
              </Tooltip>
            }

          </Grid>
          <Grid container item xs={12} justify="flex-end">
            <Attachment />
            <Wiki />
          </Grid>
        </CardActions>
      </Card>
    </Fragment>
  );
}

export default PollCard