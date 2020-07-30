import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom'
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PollIcon from '@material-ui/icons/Poll';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import ActiveAvatar from '../../components/ActiveAvatar'
import PassiveAvatar from '../../components/PassiveAvatar/'

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
  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

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
          <IconButton aria-label="add to favorites">
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
          <IconButton aria-label="share" >
            <AssignmentTurnedInIcon />
          </IconButton>
        </NavLink>
      </Tooltip>
    )
  }

  return (
    <Card className={classes.root}>
      <CardHeader className={classes.header}
        avatar={
          <Avatar />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={data.code + ': ' + data.title}
        subheader={data.startDate + ' - ' + data.endDate}
      />
      <CardContent className={classes.content}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="button" display="block" gutterBottom>
              Метод проведения: {data.way}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="button" display="block" gutterBottom>
              Вопросов/ответов: {data.questionsCount + '/' + data.answersCount}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" display="block" gutterBottom>
              Респондентов: {data.sample}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="overline" display="block" gutterBottom>
              Результатов: {data.complete}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        <Results />
        <Drive />
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded,
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography paragraph>Описание:</Typography>
          <Typography paragraph>
            Здесь говорится о замечательных свойствах проведения опроса
          </Typography>
          <Typography paragraph>
            Здесь всякая чушь про методики проведения или прикрепленные документы и распоряжения!!!!!!
          </Typography>
          <IconButton aria-label="share" >
            <AssignmentTurnedInIcon />
          </IconButton>
          <IconButton aria-label="share" >
            <AssignmentTurnedInIcon />
          </IconButton>
        </CardContent>
      </Collapse>
    </Card>
  );
}

export default PollCard