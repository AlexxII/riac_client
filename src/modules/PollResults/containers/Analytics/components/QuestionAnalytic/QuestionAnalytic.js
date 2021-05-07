import React, { Fragment, useState } from 'react'

import Button from '@material-ui/core/Button';

import Alert from '../../../../../../components/Alert'
import Accordion from '../Accordition'
import AccorditionLite from '../../containers/AccorditionLite'

const MAX_VIEW = 5

const QuestionAnalytic = ({ question, simQuestions }) => {
  const [emptyMessage, setEmptyMessage] = useState(null)

  const [allSimilar, setAllSimilar] = useState(false)
  console.log(question, simQuestions);

  const EmptyState = () => {
    if (emptyMessage) {
      const message = 'В базе данных отсутствуют вопросы с аналогичной категорией'
      return <Alert text={message} />
    } else {
      return null
    }
  }

  return (
    <Fragment>
      <Accordion question={question} />
      <p>
        {simQuestions &&
          simQuestions.map((question, index) => {
            if (index < MAX_VIEW) {
              return (
                <AccorditionLite key={question.id} question={question} />
              )
            }
          })
        }
        <div style={{ "margin": "10px 0 10px 0" }}>
          {simQuestions.length > 5
            ?
            <Button
              onClick={() => { setAllSimilar(true) }}
              variant="outlined">
              Еще {simQuestions ? ` + ${(simQuestions.length - MAX_VIEW)}` : null}
            </Button>
            :
            <EmptyState />
          }
        </div>
        {simQuestions && allSimilar &&
          simQuestions.map((question, index) => {
            if (index >= MAX_VIEW) {
              return (
                <AccorditionLite key={question.id} question={question} />
              )
            }
          })
        }
      </p>
    </Fragment>
  )
}
export default QuestionAnalytic
