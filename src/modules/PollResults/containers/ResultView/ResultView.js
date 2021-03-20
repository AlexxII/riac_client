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

const ResultView = ({ workSheets, pollQuestions, selectPool, logic, open, close, update }) => {
  const [questions, setQuestions] = useState(false)
  const [results, setResults] = useState(false)
  const [respondentId, setRespondentId] = useState(false)
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    if (selectPool.length && open) {
      const respondent = workSheets.filter(workSheet => workSheet.id === selectPool[0])[0]
      setRespondentId(respondent.id)
      const pool = respondent.result.map(result => result.code)
      const poolOfTexts = respondent.result.reduce((acum, item) => {
        acum[item.id] = item.text
        return acum
      }, {})
      const preparedResultsData = prepareResults(pool, poolOfTexts, pollQuestions)
      const modQuestions = pollQuestions.map((question, index) => {
        return questionFormationEx(question, index, logic, '', preparedResultsData, setResults)
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

  const prepareResults = (pool, poolOfTexts, pollQuestions) => {
    const pData = pollQuestions.reduce((acum, item) => {
      const answers = item.answers
      const lAnswers = answers.length
      let data = []
      let codesPool = []
      for (let j = 0; j < lAnswers; j++) {
        const answer = answers[j]
        codesPool.push(answer.code)
        if (pool.includes(answer.code)) {
          data.push({
            answerCode: answer.code,
            answerId: answer.id,
            freeAnswer: poolOfTexts[answer.id] ? poolOfTexts[answer.id] !== '' : false,
            freeAnswerText: poolOfTexts[answer.id] ? poolOfTexts[answer.id] : ''
          })
        }
      }
      acum[item.id] = {
        codesPool,
        data
      }
      return acum
    }, {})
    return {
      pool,
      ...pData
    }
  }

  const prepareSavedData = (data) => {
    console.log(data);
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

export default ResultView