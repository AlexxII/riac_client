import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const QuestionCard = ({ question, handleLimitInput }) => {
  const [val, setVal] = useState(question.limit)

  const handleKeyUp = (e) => {
    if (e.keyCode === 13) e.currentTarget.blur()
  }

  const handleChange = (e) => {
    const currentValue = e.currentTarget.value
    if (currentValue < 1) {
      setVal(1)
    } else if (currentValue > 99) {
      setVal(99)
    } else {
      setVal(currentValue)
    }
  }

  const handleBlur = (e) => {
    handleLimitInput({
      id: question.id,
      limit: val
    })
  }

  return (
    <Grid item xs={12} sm={6} md={4} lg={3} xl={2}>
      <Paper className="question-item" elevation={2}>
        <Grid item xs={12} sm container>
          <Grid item xs container direction="column" spacing={2} alignItems="flex-start">
            <Grid item xs>
              <Tooltip title="Очередность отображения" aria-label="add">
                <Typography variant="body2" color="primary">
                  {question.order}
                </Typography>
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item xs container direction="column" spacing={3} alignItems="flex-end" >
            <Grid item xs alignItems="center" style={{ cursor: 'pointer' }}>
              <Tooltip title="Меню. В разработке" aria-label="add">
                <MoreVertIcon />
              </Tooltip>
            </Grid>
          </Grid>
          <Grid item>
            <Tooltip title="Лимит ответов" aria-label="add">
              <input
                type="number"
                className="question-limit-input"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyUp={handleKeyUp}
                value={val}
              />
            </Tooltip>
          </Grid>
        </Grid>
        <Typography className="question-title">
          {question.title.length > 160 ?
            question.title.substring(0, 100) + ' ... ' + question.title.substring(question.title.length - 45) :
            question.title
          }
        </Typography>

      </Paper>
    </Grid>
  )
}

export default QuestionCard