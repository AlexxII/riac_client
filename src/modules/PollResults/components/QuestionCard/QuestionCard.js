import React, { useState } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Tooltip from '@material-ui/core/Tooltip';

import AnswerCard from '../AnswersCard'

const QuestionCard = ({ question, index, pool }) => {

  const [count, setCount] = useState(
    question.answers.reduce((acum, curr) => {
      if (curr.results.length) {
        for (let i = 0; i < curr.results.length; i++) {
          if (pool.includes(curr.results[i].respondent.id)) {
            return acum + 1
          }
          return acum
        }
      }
      return acum
    }, 0)
  )

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