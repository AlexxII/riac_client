import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import EditIcon from '@material-ui/icons/Edit';
import FlashOnIcon from '@material-ui/icons/FlashOn';
import EmojiPeopleIcon from '@material-ui/icons/EmojiPeople';
import CheckIcon from '@material-ui/icons/Check';

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

const AnswerCard = ({ answer, index, }) => {
  const [checked, setChecked] = useState(false)

  return (
    <div className={answer.disabled ? "answer-card invisible" : "answer-card"}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Box m={1}>
          <span className="answer-number">{index + 1}.</span>
          <span className="devider"> </span>
          <span className="answer-code">{answer.code}</span>
          <span className="devider"> - </span>
          <span className="answer-title">{answer.title}</span>
          <span className="answer-extend"></span>
        </Box>
        <Box m={1}>
          <ServiceIcons answer={answer} />
          {checked && <CheckIcon />}
        </Box>
      </Grid>
    </div>
  )
}

export default AnswerCard