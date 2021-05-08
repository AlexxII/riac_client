import React, { Fragment } from 'react'

const AnswerDistribution = ({ answer, index }) => {

  return (
    <Fragment>
      <div className={index % 2 == 0 ? "accordition-answer even" : "accordition-answer"}>
        <div className="column-one" onClick={() => console.log(answer)}>
          {index + 1}. {answer?.code} - {answer?.title}
        </div>
        <div className="column-two">
          {answer.results.length}
        </div>
        <div className="column-three">
          {answer.distrib}
        </div>
      </div>
    </Fragment>
  )
}

export default React.memo(AnswerDistribution)