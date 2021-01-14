import React, { Fragment } from 'react'
import Answer from "../Answer";
import MultipleAnswers from '../MultipleAnswers'

const Question = ({ count, question, clickHandler, blurHandler, multipleHandler, settings }) => {
  console.log(question);
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
            )) : <MultipleAnswers data={question.answers} limit={question.limit} settings={settings} multipleHandler={multipleHandler} />
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