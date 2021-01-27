import React, { Fragment, useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Skeleton from '@material-ui/lab/Skeleton';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import QuestionCard from '../QuestionCard'

const SingleUpdate = ({ data, respondent, logic, open, close }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [questions, setQuestions] = useState(false)
  const [userSettings, setUserSettings] = useState({
    codesShow: true
  })

  useEffect(() => {
    if (respondent) {
      const oderedResults = respondent.result.slice().sort((a, b) => (a.code > b.code) ? 1 : -1)
      // console.log(oderedResults);
      const poolOfResultsIds = respondent.result.map(result => result.id)
      console.log(poolOfResultsIds);
      const questionsEx = data.poll.questions.map(question => {

        // selectedAnswer: answerId                                 // if limit === 1
        const answersEx = question.answers.map(answer => {
          const results = answer.results
          let suffix = {
            selected: false,
            text: ''
          }
          if (results.length) {
            const lResults = results.length
            for (let i = 0; i < lResults; i++) {
              if (poolOfResultsIds.includes(results[i].id)) {
                suffix = {
                  ...suffix,
                  selected: true,
                  text: results[i].text
                }
                // TODO вписать сюда ЛОГИКУ !!!!!!!!
                break
              }
            }
          } else {
            suffix = {
              ...suffix,
              selected: false
            }
          }
          return {
            ...answer,
            ...suffix
          }
        })

        


        return {
          ...question,
          answers: answersEx
        }
      })
      console.log(questionsEx);
      setQuestions(data.poll.questions)
    }
  }, [respondent])

  if (!open) {
    return null
  }

  const codesShow = (e) => {
    setUserSettings(prevState => ({
      ...prevState,
      codesShow: !prevState.codesShow
    }))
  }

  const saveEditResult = () => {

  }

  const onClose = () => {
    setQuestions(false)
    close()
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      fullWidth
      maxWidth={"md"}
      open={open}
      onClose={close}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">
        Обновить результаты
      </DialogTitle>
      <DialogContent>
        <FormControlLabel
          control={
            <Checkbox color="primary" defaultChecked={userSettings.codesShow} />
          }
          onChange={codesShow}
          label="Коды ответов"
          labelPlacement="end"
        />
        <DialogContentText>
          {!questions ?
            (
              <Fragment>
                <Box pt={3}>
                  <Skeleton animation="wave" height={50} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <br />
                </Box>
                <Box pt={3}>
                  <Skeleton animation="wave" height={50} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <Skeleton animation="wave" height={40} />
                  <br />
                </Box>
              </Fragment>
            )
            :
            questions.map((question, index) => (
              <QuestionCard settings={userSettings} index={index} key={question.id} question={question} />
            ))
          }
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose} color="primary">
          Отмена
        </Button>
        <Button onClick={saveEditResult} color="primary" autoFocus>
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SingleUpdate