import React, { Fragment } from 'react'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'aliceblue'
  },
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
    flexBasis: '60%'
  },
  column2: {
    flexBasis: '40%',
    minWidth: '140px'
  },
}))

const AnswerDistr = ({ answer, index }) => {
  const classes = useStyles();
  return (
    <Fragment>
      <div className={index % 2 == 0 ? "accordition-answer even" : "accordition-answer"}>
        <div className={classes.column1}>
          {index + 1}. {answer.title}
        </div>
        <div className={classes.column2}>
          <input tabIndex={1 * 1000 + index} className="distr-input"></input>
          <input tabIndex={2 * 1000 + index} className="distr-input"></input>
          <input tabIndex={3 * 1000 + index} className="distr-input"></input>
          <input tabIndex={4 * 1000 + index} className="distr-input"></input>
          <input tabIndex={5 * 1000 + index} className="distr-input"></input>
          <input tabIndex={6 * 1000 + index} className="distr-input"></input>
          <input tabIndex={7 * 1000 + index} className="distr-input"></input>
        </div>
      </div>
    </Fragment>

  )
}

const AccordionEx = ({ question }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange} className={classes.root}>
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
          </div>
        </div>
      </AccordionSummary>
      <Divider variant="middle" />
      <AccordionDetails style={{ display: 'block' }} >
        <div style={{ display: 'flex' }}>
          <Typography variant="subtitle2" gutterBottom className={classes.column1}>
            <strong>Ответы:</strong>
          </Typography>
          <Typography variant="subtitle2" gutterBottom className={classes.column2}>
            <strong>Распределение:</strong>
          </Typography>
        </div>
        <div style={{ display: 'block' }}>
          {question.answers &&
            question.answers.map((answer, index) => (
              <AnswerDistr answer={answer} index={index} />
            ))
          }
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small">Отмена</Button>
        <Button size="small" color="primary">
          Сохранить
        </Button>
      </AccordionActions>
    </Accordion>
  )

}

export default AccordionEx