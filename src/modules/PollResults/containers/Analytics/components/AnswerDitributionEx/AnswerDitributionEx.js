import React, { Fragment } from 'react'

const AnswerDistributionEx = ({ answer, index, handleManualInput }) => {
  const handleInput = (e) => {
    e.preventDefault()
    const column = e.currentTarget.dataset.column
    const row = index
    let value = e.currentTarget.value
    if (value > 100) {
      value = 100.00
    }
    handleManualInput(value, column, row)
  }

  const inputs = []

  for (let i = 0; i < 6; i++) {
    inputs.push(
      <input
        key={i}
        type="number"
        step="0.1"
        max="100"
        min="0.1"
        className="distr-input"
        value={answer?.distribution[i] ? answer?.distribution[i]?.data : ''}
        data-id={answer?.distribution[i] ? answer?.distribution[i]?.id : null}
        data-column={i}
        onChange={handleInput}
        tabIndex={(i + 1) * 1000 + index}
      />
    )
  }

  return (
    <Fragment>
      <div className={index % 2 == 0 ? "accordition-answer-ex even" : "accordition-answer-ex"}>
        <div className="column-one">
          {index + 1}. {answer?.code} - {answer.title}
        </div>
        <div className="column-two">
          {inputs}
        </div>
      </div>
    </Fragment>

  )
}

export default React.memo(AnswerDistributionEx)