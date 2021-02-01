import React, { Fragment, useEffect, useState } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';

import OtherRadio from '../../components/OtherRadio'
import OtherCheckbox from '../../components/OtherCheckbox'

const QuestionCard = ({ question, index, settings, updateState }) => {
  const [currentQuestion, setCurrentQuestion] = useState(question)
  const [deletedAnswers, setDeletedAnswers] = useState([])
  const [newAnswers, setNewAnswers] = useState([])

  useEffect(() => {
    console.log('1');
    // попробовать не инициировать каждый раз! -> reset-true??
    setCurrentQuestion(question)
  }, [question])

  // в обработчиках  
  // ОБНОВЛЕНИЕ ЛОГИКИ !!!!!!! + ПОДНЯТЬ ЛОГИКУ ВВЕРХ
  // сохранить и поднять состояние об изменениях, для сохранения
  const handleCheckboxChange = (event, value) => {
    const selectedAnswerId = event.target.value
    console.log(event.target);
    const selectedCode = event.target.dataset.code
    if (value) {
      // выбор нового ответа
      setNewAnswers(prevState => ([
        ...prevState, selectedAnswerId
      ]))
      const newCurrentQuestion = {
        ...currentQuestion,
        answers: currentQuestion.answers.map(
          answer => answer.id === selectedAnswerId ? {
            ...answer, selected: true, focus: true
          } : answer
        )
      }
      // передаем состояние наверх
      updateState(newCurrentQuestion, selectedCode, 'setCheckbox')
    } else {
      // снятие выбора
      setDeletedAnswers(prevState => ([
        ...prevState, selectedAnswerId
      ]))
      const newCurrentQuestion = {
        ...currentQuestion,
        answers: currentQuestion.answers.map(
          answer => answer.id === selectedAnswerId ? {
            ...answer, selected: false, focus: false
          } : answer
        )
      }
      updateState(newCurrentQuestion, selectedCode, 'unsetCheckbox')
    }
  }

  const handleRadioChange = (e, value) => {
    const selectedAnswerId = value
    const newCurrentQuestion = {
      ...currentQuestion,
      selectedAnswer: selectedAnswerId,
      answers: currentQuestion.answers.map(
        answer => answer.id === selectedAnswerId ?
          {
            ...answer,
            focus: true
          }
          :
          {
            ...answer,
            focus: false
          }
      )
    }
    setCurrentQuestion(newCurrentQuestion)
  }

  const checkboxFreeBlur = (selectedAnswerId, text) => {
    if (text !== '') {
      const newCurrentQuestion = {
        ...currentQuestion,
        answers: currentQuestion.answers.map(
          answer => answer.id === selectedAnswerId ? {
            ...answer, text: text, selected: true, focus: false
          } : answer
        )
      }
      setCurrentQuestion(newCurrentQuestion)
    } else {
      const newCurrentQuestion = {
        ...currentQuestion,
        answers: currentQuestion.answers.map(
          answer => answer.id === selectedAnswerId ? {
            ...answer, text: '', selected: false, focus: false
          } : answer
        )
      }
      setCurrentQuestion(newCurrentQuestion)
    }
  }

  const radioFreeBlur = (selectedAnswerId, text) => {
    if (text !== '') {
      const newCurrentQuestion = {
        ...currentQuestion,
        selectedAnswer: selectedAnswerId,
        answers: currentQuestion.answers.map(
          answer => answer.id === selectedAnswerId ? {
            ...answer, text: text, focus: false
          } : answer
        )
      }
      setCurrentQuestion(newCurrentQuestion)
    } else {
      const newCurrentQuestion = {
        ...currentQuestion,
        selectedAnswer: '',
        answers: currentQuestion.answers.map(
          answer => answer.id === selectedAnswerId ? {
            ...answer, text: '', focus: false
          } : answer
        )
      }
      setCurrentQuestion(newCurrentQuestion)
    }
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
  if (question.skip) return null

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
                          onBlur={checkboxFreeBlur}
                          settings={settings}
                        />
                        :
                        <FormControlLabel
                          className="checkbox-control-label"
                          key={answer.id}
                          control={
                            <Checkbox
                              inputProps={{
                                'data-code': answer.code
                              }}
                              onChange={handleCheckboxChange}
                              checked={answer.selected}
                              value={answer.id}
                              disabled={answer.skip || answer.disabled}
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
                          onBlur={radioFreeBlur}
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