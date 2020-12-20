import React, { useEffect, useState } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';

import AnswerCard from '../AnswersCard'

const QuestionCard = ({ question, index, pool }) => {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let totalResults = 0
    for (let i = 0; i < question.answers.length; i++) {
      if (question.answers[i].results.length) {
        for (let j = 0; j < question.answers[i].results.length; j++) {
          if (pool.includes(question.answers[i].results[j].respondent.id)) {
            totalResults++
          }
        }
      }
    }
    setCount(totalResults)
  }, [])



  return (
    <Card className="question-card">
      <CardContent>
        <div className="question-header">
          <Tooltip title="Макс. кол-во ответов">
            <span className="question-limit">{question.limit}</span>
          </Tooltip>
          <span className="question-number">{index + 1}. </span>
          <span className="question-title" color="textSecondary" gutterBottom>
            {question.title}
          </span>
        </div>
        {question.answers.map((answer, index) => (
          <AnswerCard key={index} answer={answer} index={index} pool={pool} totalAnswers={count} />
        ))}
      </CardContent>
    </Card>
  )
}

export default QuestionCard