import React, { Fragment } from 'react'

import ListItem from '@material-ui/core/ListItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import Divider from '@material-ui/core/Divider';

import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';

const ListItemEx = ({ question }) => {
  return (
    <Fragment>
      <ListItem>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={false}
            tabIndex={-1}
            disableRipple
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Fragment>
              <strong>Вопрос: </strong>
              {question.title}
            </Fragment>
          }
          secondary={
            <Fragment>
              <strong>Тема: </strong>
              {`ID: ${question.topic.id} - ${question.topic.title}`}
              <br></br>
              <strong>Опрос: </strong>
              {`${question.poll.code}`}

              <Box display="flex" alignItems="center">
                <Box width="100%" mr={1}>
                  <LinearProgress
                    color={question.p * 100 > 65 ? 'primary' : 'secondary'}
                    variant="determinate" value={question.p * 100} />
                </Box>
                <Box minWidth={35}>
                  <Typography variant="body2" color="textSecondary">{`${Math.round(question.p * 100)}%`}</Typography>
                </Box>
              </Box>

            </Fragment>
          }
        />
        <ListItemSecondaryAction>
          <Tooltip title="Просмотреть ответы">
            <IconButton edge="end" onClick={() => console.log(question)}>
              <AccountTreeIcon />
            </IconButton>
          </Tooltip>
        </ListItemSecondaryAction>

      </ListItem>
      <Divider variant="inset" />
    </Fragment>
  )
}

export default ListItemEx