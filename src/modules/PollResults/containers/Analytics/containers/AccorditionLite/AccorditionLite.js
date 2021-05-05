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
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';
import errorHandler from '../../../../../../lib/errorHandler'

import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_QUESTION_RESULTS } from './queries'


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
  },
  details: {
    alignItems: 'center',
    display: 'flex'
  },
  detFlex: {
    display: 'block'
  },
  column1: {
    flexBasis: '80%'
  },
  column2: {
    textAlign: 'center',
    flexBasis: '10%',
    minWidth: '40px'
  },
  column3: {
    textAlign: 'center',
    flexBasis: '10%',
    minWidth: '40px'
  },
}))

const AnswerDistr = ({ answer, index }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={index % 2 == 0 ? "accordition-answer even" : "accordition-answer"}>
        <div className={classes.column1} onClick={() => console.log(answer)}>
          {index + 1}. {answer?.code} - {answer?.title}
        </div>
        <div className={classes.column2}>
          {answer.results.length}
        </div>
        <div className={classes.column3}>
          {answer.distrib}
        </div>
      </div>
    </Fragment>
  )
}

const AccordionLite = ({ question }) => {
  const classes = useStyles();
  const [noti, setNoti] = useState(false)
  const [answers, setAnswers] = useState(null)
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false)

  const [getAnswersResults, { loading: answersResultsLoading, data: answersResultsData }] = useLazyQuery(GET_QUESTION_RESULTS, {
    onError: ({ graphQLErrors }) => {
      setNoti(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    }
  });

  useEffect(() => {
    if (answersResultsData && !answersResultsLoading) {
      const answers = answersResultsData.answersWithResults.answers
      // всего ответов
      const allResultsCount = answers.reduce((acum, item) => {
        acum += item.results.length
        return acum
      }, 0)
      // тип вопроса: 1 - один ответ, 2 - несколько ответов, 3 - только ввод ответа (один свободный ответ на вопрос)
      const qType = question.type
      let uAnswers = []
      //
      console.log(typeof qType);
      switch (qType) {
        case 1:
          uAnswers = answers.map(answer =>
          ({
            ...answer,
            distrib: (answer.results.length / allResultsCount * 100).toFixed(1)
          }))
          break
        case 2:

        case 3:
        default:
          setNoti()
      }
      console.log(uAnswers);
      setAnswers(uAnswers)
    }
  }, [answersResultsData])

  const handleChange = (_, isExpanded) => {
    getAnswersResults({
      variables: {
        id: question.id
      }
    })
    setExpanded(isExpanded);
    setTimeout(rr, 700)
  };

  const rr = () => {
    setLoading(false)
  }

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
      <AccordionDetails style={{ display: 'block', wordWrap: 'break-word' }} >
        <div style={{ display: 'flex' }}>
          <Typography variant="subtitle2" gutterBottom className={classes.column1}>
            <strong>Ответы:</strong>
          </Typography>
          <Typography variant="subtitle2" gutterBottom className={classes.column2}>
            <strong>Ответов:</strong>
          </Typography>
          <Typography variant="subtitle2" gutterBottom className={classes.column2}>
            <strong>Процентов:</strong>
          </Typography>
        </div>
        <div style={{ display: 'block' }}>
          {answersResultsLoading ?
            <Fragment>
              <div style={{ textAlign: 'center' }}>
                <CircularProgress />
              </div>
            </Fragment>
            :
            answers &&
            answers.map((answer, index) => (
              <AnswerDistr key={answer.id} answer={answer} index={index} />
            ))
          }
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" color="primary">Загрузить</Button>
      </AccordionActions>
    </Accordion>
  )

}

export default AccordionLite