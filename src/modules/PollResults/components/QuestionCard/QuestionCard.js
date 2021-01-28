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

import OtherRadio from '../../components/OtherRadio'
import OtherCheckbox from '../../components/OtherCheckbox'

import { Fragment } from 'react';

const QuestionCard = ({ question, index, settings }) => {
  const [currentQuestion, setCurrentQuestion] = useState(question)

  //в обработчиках  
  // ОБНОВЛЕНИЕ ЛОГИКИ !!!!!!! + ПОДНЯТЬ ЛОГИКУ ВВЕРХ
  // сохранить и поднять состояние об изменениях, для сохранения

  const handleCheckboxChange = (event, value) => {
    const selectedAnswerId = event.target.value
    if (value) {
      // выбор нового ответа
      setCurrentQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.id === selectedAnswerId ? { ...answer, selected: true } : answer
        )
      }))

    } else {
      // снятие выбора
      setCurrentQuestion(prevState => ({
        ...prevState,
        answers: prevState.answers.map(
          answer => answer.id === selectedAnswerId ? { ...answer, selected: false } : answer
        )
      }))
    }
  }

  const handleRadioChange = (event, value) => {
    const selectedAnswerId = value
    setCurrentQuestion(prevState => ({
      ...prevState,
      selectedAnswer: selectedAnswerId
    }))
  }

  const handleOtherRadioChange = (_, __, ___) => {
    console.log(_, __, ___);
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
        <FormControl component="fieldset" className="question-form-control">
          <FormLabel className="question-title" component="legend">{`${index + 1}. ${currentQuestion.title}`}</FormLabel>
          {
            currentQuestion.limit > 1 ?
              (
                <FormGroup>
                  {
                    currentQuestion.answers.map(answer => (
                      answer.freeAnswer ?
                        <OtherCheckbox
                          answer={answer}
                          onChange={handleCheckboxChange}
                          settings={settings}
                        />
                        :
                        <FormControlLabel
                          className="checkbox-control-label"
                          control={
                            <Checkbox
                              key={answer.id}
                              onChange={handleCheckboxChange}
                              checked={answer.selected}
                              value={answer.id}
                              disabled={answer.disabled}
                            />
                          }
                          name={currentQuestion.id}
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
                <RadioGroup
                  aria-label={currentQuestion.id}
                  name={currentQuestion.id}
                  onChange={handleRadioChange}
                  value={currentQuestion.selectedAnswer}
                >
                  {
                    currentQuestion.answers.map(answer => (
                      answer.freeAnswer ?
                        <OtherRadio
                          answer={answer}
                          settings={settings}
                        />
                        :
                        <FormControlLabel
                          className="radio-control-label"
                          value={answer.id}
                          key={answer.id}
                          control={<Radio />}
                          label={
                            <AnswerTitle answer={answer} />
                          }
                          disabled={answer.disabled}
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