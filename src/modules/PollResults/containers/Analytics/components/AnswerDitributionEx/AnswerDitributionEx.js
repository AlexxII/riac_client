import React, { Fragment, useState } from 'react'

const AnswerDistributionEx = ({ answer, index, handleManualInput }) => {
  const handleInput = (e) => {
    e.preventDefault()
    const i = e.currentTarget.dataset.index
    let value = e.currentTarget.value
    if (value > 100) {
      e.currentTarget.value = 100.00
      value = 100.00
    }
    handleManualInput(value, index)
  }

  const inputs = []

  for (let i = 0; i < 6; i++) {
    inputs.push(
      <input
        key={i}
        type="number"
        step="0.01"
        max="100"
        className="distr-input"
        defaultValue={answer?.distribution[i]?.data}
        data-index={i}
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