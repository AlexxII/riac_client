import React, { Fragment, useEffect, useState } from 'react'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { makeStyles } from '@material-ui/core/styles';

import AanswerDistributionEx from '../../components/AnswerDitributionEx'

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

const AnalyzedQuestion = ({ question, handleReset, handleManualInput }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  return (
    <Accordion
      className="analyzed-question"
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
      <AccordionDetails className="details" >
        <div style={{ display: 'flex' }}>
          <Typography variant="subtitle2" gutterBottom className="column-one">
            <strong>Ответы:</strong>
          </Typography>
          <Typography variant="subtitle2" gutterBottom className="column-two">
            <strong>Распределение:</strong>
          </Typography>
        </div>
        <div style={{ display: 'block' }}>
          {question.answers &&
            question.answers.map((answer, index) => (
              <AanswerDistributionEx key={answer.id} answer={answer} index={index} handleManualInput={handleManualInput} />
            ))
          }
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" onClick={handleReset}>Сбросить</Button>
        <Button size="small" color="primary">
          Сохранить
        </Button>
      </AccordionActions>
    </Accordion>
  )

}

export default React.memo(AnalyzedQuestion)