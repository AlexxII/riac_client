import React, { Fragment, useRef } from 'react'

import FreeAnswer from '../FreeAnswer'

const Answer = ({ answer, clickHandler, focusHandler, blurHandler }) => {
  const answerRef = useRef(null)

  let answerCls = ['answer-wrap']
  if (answer.selected) {
    answerCls.push('selected')
  }
  if (answer.disabled) {
    answerCls.push('disabled')
  }

  const click = () => {
    clickHandler(answerRef.current)
  }

  return (
    <Fragment>
      <div onClick={(e) => click(e)}
        className={answerCls.join(' ')}
        ref={answerRef}
        data-code={answer.keyCode} >
        <h4 >
          <span>{answer.showIndex}</span>
          <span> </span>
          {answer.codeShow &&
            <span style={{ fontSize: '10px' }}>{answer.code}</span>
          }
          <span> - </span>
          <span>{answer.title}</span>
        </h4>
        <div>
          {answer.showFreeAnswer && (
            <FreeAnswer
              answer={answer}
              focus={answer.focus}
              focusHandler={focusHandler}
              blurHandler={blurHandler}
            />
          )}
        </div>
      </div>
    </Fragment>
  )
}
export default Answer