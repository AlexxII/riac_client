import React, { Fragment } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import MultipleAnswers from '../../../PollDrive/components/MultipleAnswers'
import OtherRadio from '../OtherRadio'
import OtherCheckbox from '../OtherCheckbox'

const QuestionCard = ({ visibleCount, question, settings, updateState, blurHandle, multipleHandler, reset }) => {

  if (question.skip) return null

  const handleCheckboxChange = (event, value) => {
    const selectedAnswerId = event.target.value
    const selectedAnswer = question.answers.filter(answer => (answer.id === selectedAnswerId))[0]
    if (value) {
      // выбор нового ответа
      // передаем состояние наверх
      updateState(selectedAnswer, question, 'set')
    } else {
      // снятие выбора
      updateState(selectedAnswer, question, 'unset')
    }
  }

  const handleRadioChange = (e, value) => {
    const selectedAnswerId = value
    const selectedAnswer = question.answers.filter(answer => (answer.id === selectedAnswerId))[0]
    updateState(selectedAnswer, question, 'radio')
  }

  const AnswerTitle = ({ answer, disabled }) => {
    if (settings.codesShow) {
      return (
        <Fragment>
          <span className={disabled ? "answer-code hide" : "answer-code"} >{answer.code} - </span>
          {answer.title}
          <span className="exclude-message">{answer.excludeM}</span>
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
          <FormLabel className="question-title" component="legend">{`${visibleCount + 1}. ${question.title}`}</FormLabel>
          <Grid container direction="row" justify="flex-end" alignItems="center" className="header-service-zone">
            <Button variant="outlined" size="small" color="secondary" onClick={reset}>
              Сбросить
          </Button>
          </Grid>
          {!question.mega ?
            question.limit > 1 ?
              (
                <FormGroup>
                  {
                    question.answers.map(answer => (
                      answer.freeAnswer && answer.selected ?
                        <OtherCheckbox
                          answer={answer}
                          onChange={handleCheckboxChange}
                          onBlur={blurHandle}
                          settings={settings}
                        />
                        :
                        <FormControlLabel
                          className="checkbox-control-label"
                          key={answer.id}
                          control={
                            <Fragment>
                              <span style={{ fontSize: '20px', fontWeight: 700, paddingRight: '10px' }}>{answer.showIndex}</span>
                              <Checkbox
                                className="checkbox"
                                inputProps={{
                                  'data-code': answer.code
                                }}
                                onChange={handleCheckboxChange}
                                checked={answer.selected}
                                value={answer.id}
                                disabled={answer.disabled}
                              />
                            </Fragment>
                          }
                          disabled={answer.disabled}
                          name={question.id}
                          label={
                            <AnswerTitle answer={answer} disabled={answer.disabled} />
                          }
                        />
                    ))
                  }
                </FormGroup>
              )
              :
              (
                <RadioGroup
                  aria-label={question.id}
                  name={question.id}
                  onChange={handleRadioChange}
                  value={question.selectedAnswer}
                >
                  {
                    question.answers.map(answer => (
                      answer.freeAnswer && answer.selected ?
                        <OtherRadio
                          answer={answer}
                          settings={settings}
                          onBlur={blurHandle}
                        />
                        :
                        <FormControlLabel
                          className="radio-control-label"
                          value={answer.id}
                          key={answer.id}
                          control={<Radio />}
                          label={
                            <AnswerTitle answer={answer} disabled={answer.disabled} />
                          }
                          disabled={answer.disabled}
                        />
                    ))
                  }
                </RadioGroup>
              )
            :
            <MultipleAnswers data={question.answers} limit={question.limit} settings={settings} multipleHandler={multipleHandler} />
          }
        </FormControl>
      </CardContent>
    </Card>
  )
}

export default QuestionCard