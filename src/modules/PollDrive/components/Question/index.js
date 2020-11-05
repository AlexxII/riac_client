import React, { Fragment, useState } from 'react'
import Answer from "../Answer";
import Tags from '../MultipleAnswers'

const Question = ({ count, question, clickHandler, focusHandler, blurHandler, multipleHandler, settings }) => {
  function FlatAnswer() {
    return (
      question.answers.map((answer, i) => (
        <Answer key={i} answer={answer}
          clickHandler={clickHandler}
          focusHandler={focusHandler}
          blurHandler={blurHandler}
          settings={settings}
        />
      )))
  }

  return (
    <Fragment>
      <span className="drive-question-card">
        <h3 className="question-title-card" >
          <span className={"question-number"}>{count + 1}</span>
          <span> - </span>
          {question.title}</h3>
        <div>{
          !question.mega ?
            question.answers.map((answer, i) => (
              <Answer key={i} answer={answer}
                clickHandler={clickHandler}
                focusHandler={focusHandler}
                blurHandler={blurHandler}
                settings={settings}
              />
            )) : <Tags data={question.answers} limit={question.limit} settings={settings} multipleHandler={multipleHandler} />
        }
        </div>
      </span>
    </Fragment>
  )
}
export default Question