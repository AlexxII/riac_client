import React, { Fragment } from 'react'

import Answer from "../Answer";

const Question = ({ question, clickHandler, focusHandler, blurHandler }) => {

  return (
    <Fragment>
      <h3>{question.title}</h3>
      <div>
        {question.newAnswers.map((answer, i) => (
          <Answer key={i} answer={answer}
            clickHandler={clickHandler}
            focusHandler={focusHandler}
            blurHandler={blurHandler}
          />
        ))}
      </div>
    </Fragment>
  )
}
export default Question