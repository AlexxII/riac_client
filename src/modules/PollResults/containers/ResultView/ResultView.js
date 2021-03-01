import React, { useState, useEffect } from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

import questionFormationEx from '../../../PollDrive/lib/questionFormationEx'

import QuestionCard from '../../../PollDrive/components/QuestionCard'

const BatchUpdate = ({ data, selectPool, logic, open, close, update }) => {
  const [questions, setQuestions] = useState(false)
  const [results, setResults] = useState(false)
  const [respondentId, setRespondentId] = useState(false)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (selectPool.length && open) {
      const questions = data.poll.questions
      const respondent = data.poll.results.filter(result => result.id === selectPool[0])[0]
      setRespondentId(respondent.id)
      const modeResults = prepareSavedData(respondent)
      setResults(modeResults)
      const modQuestions = questions.map((question, index) => {
        return questionFormationEx(question, index, logic, modeResults, setResults)
      })
      setQuestions(modQuestions)
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleUpdate = () => {
    update({ id: respondentId })
    close()
  }

  const prepareSavedData = (data) => {
    const pool = data.result.map(result =>
      result.code
    )
    const dd = data.result.reduce((acum, item) => {
      acum[item.question.id] = {
        count: item.question.order - 1,
        codesPool: item.question.codesPool,
        data: acum[item.question.id] ?
          [
            ...acum[item.question.id].data,
            {
              answerCode: item.code,
              answerId: item.answer.id,
              freeAnswer: item.text !== '',
              freeAnswerText: item.text
            }
          ]
          :
          [{
            answerCode: item.code,
            answerId: item.answer.id,
            freeAnswer: item.text !== '',
            freeAnswerText: item.text

          }]
      }
      return acum
    }, {})
    return {
      pool,
      ...dd
    }
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      maxWidth={"md"}
      open={open}
      onClose={close}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{"Просмотр результата"}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {questions &&
            questions.map((question, index) => (
              <QuestionCard
                visibleCount={index}
                question={question}
                codesShow={true}
                key={question.id}
                updateState={() => { return false }}
                blurHandle={() => { return false }}
                multipleHandler={() => { return false }}
                viewOnly={true}
              />
            ))}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleUpdate} color="primary">
          Обновить
        </Button>
        <Button autoFocus onClick={close} color="primary">
          Закрыть
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BatchUpdate