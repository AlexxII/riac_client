import React, { useEffect, useState } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';

import { Fragment } from 'react';

const QuestionCard = ({ question, index, settings }) => {
  const handleChange = (event, value) => {
    const currentQuestion = event.target.name
    const selectedAnswer = event.target.value
    console.log(currentQuestion, selectedAnswer, value);
  }

  const handleRadioChange = (event, value) => {
    const currentQuestion = event.target.name
    const selectedAnswer = value
    console.log(currentQuestion, selectedAnswer);
  }

  const AnswerTitle = ({ answer }) => {
    if (settings.codesShow) {
      return (
        <Fragment>
          <span className={"answer-code"}>{answer.code} - </span>
          {answer.title}
        </Fragment>
      )
    } else {
      return (
        answer.title
      )
    }
  }

  return (
    <Card className="question-card">
      <CardContent>
        <FormControl component="fieldset">
          <FormLabel component="legend">{`${index + 1}. ${question.title}`}</FormLabel>
          {
            question.limit > 1 ?
              (
                <FormGroup>
                  {
                    question.answers.map((answer, index) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            key={answer.id}
                            onChange={handleChange}
                            checked={false}
                            value={answer.id}
                            disabled={index === 3}
                          />
                        }
                        name={question.id}
                        label={
                          <AnswerTitle answer={answer} />
                        }
                      />
                    ))
                  }
                </FormGroup>
              )
              :
              (
                <RadioGroup aria-label={question.id} name={question.id} onChange={handleRadioChange} >
                  {
                    question.answers.map((answer, index) => (
                      <FormControlLabel
                        value={answer.id}
                        key={answer.id}
                        control={<Radio />}
                        label={
                          <AnswerTitle answer={answer} />
                        }
                        disabled={index === 2}
                      />
                    ))
                  }
                </RadioGroup>
              )
          }
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default QuestionCard