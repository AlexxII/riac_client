import React, { Fragment, useState } from 'react'

const AnswerDistributionEx = ({ answer, index }) => {
  const [distibVal, setDistibVal] = useState({
    '0': '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '5': '',
    '6': '',
  })

  const handleInput = (e) => {
    e.preventDefault()
    const value = e.currentTarget.value
    const i = e.currentTarget.dataset.index
    setDistibVal({
      ...distibVal,
      [i]: value
    })
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
        value={distibVal[i].int}
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