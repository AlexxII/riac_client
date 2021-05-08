import React, { Fragment, useEffect, useState } from 'react'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import AnswerDistribution from '../../components/AnswerDitribution'

const useStyles = makeStyles((theme) => ({
  header: {
    display: 'block'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  }
}))

const SimilarQuestion = ({ question, loadAnswers }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);

  const handleChange = (_, isExpanded) => {
    if (isExpanded) {
      loadAnswers(question.id)
    }
    setExpanded(isExpanded);
  };

  const handleLoadKey = () => {
    // информация об опросе данного вопроса
    const qPoll = question.poll
    // const rAnswers = answers.reduce((acum, item, index) => {
    //   acum[index] = {
    //     distribution: item.distrib,
    //     answerId: item.id,
    //     poll: qPoll
    //   }
    //   return acum
    // }, {})
    // console.log(rAnswers);
    // console.log(question, answers);
  }
  useEffect(() => {
    console.log(question);
  }, [question])

  return (
    <Accordion
      className="accordition-lite"
      expanded={expanded}
      onChange={handleChange}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <div className={classes.header}>
          <div>
            <Typography className={classes.heading}>
              <Fragment>
                <strong>Вопрос: </strong>
                {question.title}
              </Fragment>
            </Typography>
          </div>
          <div>
            <Typography className={classes.secondaryHeading}>
              <Fragment>
                <strong>Тема: </strong>
                {`ID: ${question.topic.id} - ${question.topic.title}`}
              </Fragment>
            </Typography>
            <Typography className={classes.secondaryHeading}>
              <Fragment>
                <strong>Опрос: </strong>
                {`ID: ${question.poll.code} - ${question.poll.title}`}
              </Fragment>
            </Typography>
          </div>
          <div>
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
          </div>
        </div>
      </AccordionSummary>
      <Divider variant="middle" />
      <AccordionDetails className="similar-details" >
        <div className="display-flex">
          <Typography variant="subtitle2" gutterBottom className="column-one">
          </Typography>
          <Typography variant="subtitle2" gutterBottom className="column-two">
            <strong>Ответов:</strong>
          </Typography>
          <Typography variant="subtitle2" gutterBottom className="column-three">
            <strong>Процентов:</strong>
          </Typography>
        </div>
        <div style={{ display: 'block' }}>
          {!question.answers ?
            <Fragment>
              <div style={{ textAlign: 'center' }}>
                <CircularProgress />
              </div>
            </Fragment>
            :
            question.answers.length &&
            question.answers.map((answer, index) => (
              <AnswerDistribution key={answer.id} answer={answer} index={index} />
            ))
          }
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" color="primary" onClick={handleLoadKey}>Загрузить</Button>
      </AccordionActions>
    </Accordion>
  )
}

export default SimilarQuestion