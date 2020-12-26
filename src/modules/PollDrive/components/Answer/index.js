import React, { Fragment, useRef } from 'react'
import FreeAnswer from '../FreeAnswer'
import EditIcon from '@material-ui/icons/Edit';

const Answer = ({ answer, clickHandler, focusHandler, blurHandler, settings }) => {
  const answerRef = useRef(null)
  let answerCls = ['answer-wrap']
  let answerTitle = ['answer-title']
  if (answer.selected) {
    answerCls.push('selected')
  }
  if (answer.disabled) {
    answerTitle.push('disabled')
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
        <div className={"answer-title"}>
          <span className={"answer-key"}>{answer.showIndex}</span>
          <span> </span>
          {settings.codesShow &&
            <span className={"answer-code"} >{answer.code}</span>
          }
          <span> - </span>
          <span className={answerTitle.join(' ')}>{answer.title}</span>
          <span className="free-answer-icon">{answer.freeAnswer ? <EditIcon fontSize="small" /> : null}</span>
          <span className="answer-exclude-message">{answer.excludeM}</span>
        </div>
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