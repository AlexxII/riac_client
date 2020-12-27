import React, { Fragment, useRef } from 'react'
import FreeAnswer from '../FreeAnswer'
import EditIcon from '@material-ui/icons/Edit';

const Answer = ({ answer, clickHandler, blurHandler, settings }) => {
  let answerCls = ['answer-wrap']
  let answerTitle = ['answer-title']
  if (answer.selected) {
    answerCls.push('selected')
  }
  if (answer.disabled) {
    answerTitle.push('disabled')
  }

  const click = (e) => {
    console.log(e.target.tagName);
    if (e.target.tagName === 'INPUT') {
      return
    }
    clickHandler(answer.keyCode)
  }

  const clickOnFreeAnswer = (e) => {
    console.log('wwwwwww')
  }

  return (
    <Fragment>
      <div onClick={(e) => click(e)}
        className={answerCls.join(' ')}
        data-code={answer.keyCode}
        id="answer-wrap"
      >
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
              onClick={(e) => clickOnFreeAnswer(e)}
              answer={answer}
              blurHandler={blurHandler}
              id="free-answer-wrap"
            />
          )}
        </div>
      </div>
    </Fragment>
  )
}
export default Answer