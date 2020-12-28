import React, { Fragment, useState } from 'react'
import Answer from "../Answer";
import Tags from '../MultipleAnswers'

const Question = ({ count, question, clickHandler, blurHandler, multipleHandler, settings }) => {
  const AnswersPool = () => {
    return (
      <Fragment>
        {
          !question.mega ?
            question.answers.map((answer, i) => (
              <Answer key={i} answer={answer}
                clickHandler={clickHandler}
                blurHandler={blurHandler}
                settings={settings}
              />
            )) : <Tags data={question.answers} limit={question.limit} settings={settings} multipleHandler={multipleHandler} />
        }
      </Fragment>
    )
  }

  return (
    <Fragment>
      <span className="drive-question-card">
        <h3 className="question-title-card" >
          <span className={"question-number"}>{count + 1}</span>
          <span> - </span>
          {question.title}</h3>
        <div>
          <AnswersPool />
        </div>
      </span>
    </Fragment>
  )
}
export default Question