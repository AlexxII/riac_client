import React from 'react'

import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';

const ServiceIcons = ({ answer }) => {
  const edit = (
    <Tooltip title="Свободный ответ">
      <EditIcon />
    </Tooltip>
  )
  const difficult = (
    <Tooltip title="Затрудняюсь ответить">
      <EmojiPeopleIcon />
    </Tooltip>
  )
  const unique = (
    <Tooltip title="Уникальный ответ">
      <FlashOnIcon />
    </Tooltip>
  )
  let r = []
  if (answer.difficult) {
    r.push(difficult)
  }
  if (answer.freeAnswer) {
    r.push(edit)
  }
  if (answer.unique) {
    r.push(unique)
  }
  return r
}

const AnswerCard = ({ answer, index }) => {
  return (
    <div className={answer.disabled ? "answer-card invisible" : "answer-card"}>
      <span className="answer-number">{index + 1}.</span>
      <span className="devider"> </span>
      <span className="answer-code">{answer.code}</span>
      <span className="devider"> - </span>
      <span className="answer-title">{answer.title}</span>
      <span className="answer-extend">
        <ServiceIcons answer={answer} />
      </span>
    </div>
  )
}

export default AnswerCard