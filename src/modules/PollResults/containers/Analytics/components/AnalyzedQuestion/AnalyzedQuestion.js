import React, { Fragment, useEffect, useState } from 'react'

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionActions from '@material-ui/core/AccordionActions';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import { makeStyles } from '@material-ui/core/styles';

import AanswerDistributionEx from '../../components/AnswerDitributionEx'
import { Checkbox } from '@material-ui/core';

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

const AnalyzedQuestion = ({ question, handleReset, handleManualInput, handleSingleDel, handleSave }) => {
  const classes = useStyles();
  const [expanded, setExpanded] = useState(false);
  const [total, setTotal] = useState(false)

  useEffect(() => {
    const qDistribCount = question.answers.reduce((acum, item) => {
      for (let key in acum) {
        acum[key] += item.distribution[key] ? +item.distribution[key].data : +0
      }
      return acum
    }, {
      '0': 0,
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0,
    })
    setTotal(qDistribCount)
  }, [question])


  const handleChange = (_, isExpanded) => {
    setExpanded(isExpanded);
  };

  const inputCount = []

  for (let i = 0; i < 6; i++) {
    inputCount.push(
      <div>
        {total[i]}
      </div>
    )

  }

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
              <AanswerDistributionEx key={answer.id}
                answer={answer}
                index={index}
                handleManualInput={handleManualInput}
              />
            ))
          }
          <div className="service-area">
            <div className="column-one">
            </div>
            <div className="column-two">
              {
                [0, 1, 2, 3, 4, 5].map((_, index) => (
                  <Fragment>
                    <div className="distr-reset">
                      <div className="count-wrap">
                        <div className={total[index] > 100.0001 ? "count-warning" : null} >
                          {total[index] > 0 ? total[index].toFixed(1) : null}
                        </div>
                      </div>
                      <IconButton aria-label="delete" onClick={() => handleSingleDel(index)} size="small">
                        <HighlightOffIcon />
                      </IconButton>
                    </div>
                  </Fragment>
                ))
              }
            </div>
          </div>
        </div>
      </AccordionDetails>
      <Divider />
      <AccordionActions>
        <Button size="small" onClick={handleReset}>Сбросить</Button>
        <Button size="small" color="primary" onClick={handleSave}>Сохранить</Button>
      </AccordionActions>
    </Accordion>
  )

}

export default AnalyzedQuestion