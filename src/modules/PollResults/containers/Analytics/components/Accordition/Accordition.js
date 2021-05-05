import React, { Fragment, useState } from 'react'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

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
    flexBasis: '60%'
  },
  column2: {
    flexBasis: '40%',
    minWidth: '140px'
  },
}))

const AnswerDistr = ({ answer, index }) => {
  const [distibVal, setDistibVal] = useState({
    '0': {
      int: '23',
      code: ''
    },
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
  })
  const classes = useStyles();

  const handleInput = (e) => {
    e.preventDefault()
    const value = e.currentTarget.value
    const i = e.currentTarget.dataset.index
    setDistibVal({
      ...distibVal,
      [i]: value
    })
  }

  const inputs = []

  for (let i = 0; i < 6; i++) {
    inputs.push(
      <input
        key={i}
        type="number"
        step="0.01"
        max="100"
        className="distr-input"
        value={distibVal[i].int}
        data-index={i}
        onChange={handleInput}
        tabIndex={(i + 1) * 1000 + index}
      />
    )
  }

  return (
    <Fragment>
      <div className={index % 2 == 0 ? "accordition-answer even" : "accordition-answer"}>
        <div className={classes.column1}>
          {index + 1}. {answer?.code} - {answer.title}
        </div>
        <div className={classes.column2}>
          {inputs}
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
    <Accordion
      className="primary"
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
              <AnswerDistr key={answer.id} answer={answer} index={index} />
            ))
          }
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small">Сбросить</Button>
        <Button size="small" color="primary">
          Сохранить
        </Button>
      </AccordionActions>
    </Accordion>
  )

}

export default AccordionEx