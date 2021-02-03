import React, { Fragment, useEffect, useState } from 'react'

import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Hidden from '@material-ui/core/Hidden';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Prompt } from 'react-router-dom'

import FinishDialog from '../FinishDialog';
import QuestionCard from '../../../PollResults/components/QuestionCard'

import defineSelectedAnswer from '../../lib/defineSelectedAnswer'
import questionFormationEx from '../../lib/questionFormationEx'

import beep from '../../lib/beep'

const KEY_TYPE = 'keyup'
const STEP_DELAY = 0
const MOVE_DELAY = 0

const ANSWER_SELECTED = 1
const RESET_RESULTS = 2
const CONFIRM_QUESTION = 3
const SKIP = 4

const DriveLogicEx = ({ poll, logics, setCurrentQuestion, saveAndGoBack, saveWorksheet }) => {
  const questionsLimit = poll.questions.length
  const [question, setQuestion] = useState(null)
  const [userSettings, setUserSettings] = useState({
    codesShow: true
  })
  const [direction, setDirection] = useState(1)
  const [logic] = useState(logics)
  const [count, setCount] = useState(0)
  const [visibleCount, setVisibleCount] = useState(0)
  const [results, setResults] = useState(
    {
      pool: []
    }
  )
  const [finish, setFinish] = useState(false)
  const [userBack, setUserBack] = useState(false)
  const [finishDialog, setFinishDialog] = useState(false)
  const [inlineMessage, setInlineMessage] = useState('')

  useEffect(() => {
    document.addEventListener(KEY_TYPE, keyUpHandler)
    return () => {
      document.removeEventListener(KEY_TYPE, keyUpHandler)
    };
  })

  // Кнопка с треброванием выдать ID и сохранить !!!!!!!!!!!!!!!!!!!!!!!!

  useEffect(() => {
    // первичная инициализация, наложение логики и сохранение в стор следующего вопроса + восстановление промежуточных итогов

    const nextQuestion = questionFormationEx(poll.questions[count], count, results, logic, setResults);
    console.log(nextQuestion);

    // const newQuestion = questionFormation(poll, count, results, logic, setResults);
    // if (!nextQuestion) return
    if (!nextQuestion) {
      if (direction) {
        if (count === questionsLimit - 1) {
          checkRespondentFinish(nextQuestion.results)
          // setEarlyСompletion(true)
          return
        }
        setCount(count + 1)
      } else {
        setCount(count - 1)
      }
      return
    }
    setQuestion(nextQuestion)
  }, [count])

  const keyUpHandler = ({ target, keyCode }) => {
    if (target.nodeName === 'BODY') {
      const nextStep = defineSelectedAnswer(keyCode)
      switch (nextStep.do) {
        case ANSWER_SELECTED: {
          mainLogic(nextStep.trueCode)
          return
        }
        case CONFIRM_QUESTION: {
          confirmResults()
          return
        }
        case RESET_RESULTS: {
          resetAnswers()
          return
        }
        case SKIP: {
          return                                                    // нажата системная клавиша, не относящаяся к опросу
        }
        default: {
          return
        }
      }
    }
  }

  const confirmResults = () => {
    if (finish) {
      finishRespondent()
    } else {
      if (results[question.id].data.length) {
        goToNext()
        return
      }
      beep()
    }
  }

  const goToNext = () => {
    setDirection(1)
    if (count < questionsLimit - 1) {
      setCount(count + 1)
    } else {
      setCount(0)
    }
  }

  const goToPrevious = () => {
    setDirection(0)
    if (count === 0) {
      setCount(questionsLimit - 1)
    } else {
      setCount(count - 1)
    }
  }

  const mainLogic = () => {

  }

  const checkRespondentFinish = () => {

  }

  const resetAnswers = () => {

  }

  /// ПОКА НЕ ЗНАЮ!!!!!!!!!!!!1
  const updateState = () => {

  }

  const finishRespondent = () => {
    setFinishDialog(true)
  }

  const codesShow = (e) => {
    setUserSettings(prevState => ({
      ...prevState,
      codesShow: !prevState.codesShow
    }))
  }

  const cancelFinish = () => {
    // просто возврат к анкете, чтобы что-то поправить
    setFinishDialog(false)
  }

  const confirmFinish = () => {
    // закончить данную анкету и начать новую, сбросив все данные
    saveWorksheet(results)
    setResults({
      pool: []
    })
    setUserBack(true)
    setCount(0)
    setFinish(false)
    setFinishDialog(false)
  }

  const finishThisPoll = () => {
    // закончить данный опрос и перейти на главную страницу
    setFinish(false)
    setUserBack(true)
    setFinishDialog(false)
    saveAndGoBack(results)
  }

  const InlineInformer = () => {
    return (
      <Typography variant="overline" display="block" gutterBottom>
        {inlineMessage}
      </Typography>
    )
  }

  return (
    <Fragment>
      <Prompt
        when={results.pool.length}
        message={() => {
          return userBack
            ? true
            : "Вы действительно хотите покинуть страницу ввода данных. Сохраненные данные будут потеряны!"
        }}
      />
      <FinishDialog open={finishDialog} handleClose={cancelFinish} finishAll={finishThisPoll} confirm={confirmFinish} />
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item container xs={6} md={3} justify="flex-start">
          <FormControlLabel
            value="end"
            control={<Checkbox color="primary" onChange={codesShow} defaultChecked={userSettings.codesShow} />}
            label="Коды ответов"
            labelPlacement="end"
          />
        </Grid>
        <Hidden only={['sm', 'xs']}>
          <Grid item container md={6} justify="center">
            <InlineInformer />
          </Grid>
        </Hidden>
        <Grid item container xs={6} md={3} justify="flex-end">
          <p>Всего: <span><strong>{questionsLimit}</strong></span></p>
        </Grid>
        <Hidden mdUp>
          <Grid item container xs={12} justify="center">
            <InlineInformer />
          </Grid>
        </Hidden>
        {question &&
          <QuestionCard settings={userSettings} index={count} key={question.id} question={question} updateState={updateState} />
        }
      </Grid>

      <Button onClick={goToPrevious} variant="contained" className="control-button">Назад</Button>
      <Button onClick={goToNext} variant="contained" className="control-button">Вперед</Button>
      {finish &&
        <Button onClick={finishRespondent} variant="contained" className="control-button">Финиш</Button>
      }
    </Fragment>
  )
}

export default DriveLogicEx