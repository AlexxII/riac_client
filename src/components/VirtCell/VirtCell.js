import React from 'react'

import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import ListAltIcon from '@material-ui/icons/ListAlt'
import { Paper } from '@material-ui/core';

const VirtCell = ({ respondent, index, show, edit, selected, select, count }) => {
  return (
    <Paper className="respondent-card">
      <Grid container item justify="space-between">
        <Typography variant="h6" gutterBottom>
          {index}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {respondent.id}
        </Typography>
        <Checkbox
          color="primary"
          checked={false}
        />
      </Grid>
      <Typography variant="subtitle2" gutterBottom>
        н.п.: {'Мурманск'}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        сохранен: {"09042019"}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        обновлен: {"09042019"}
      </Typography>
      <Grid container item justify="space-between" className="card-service-buttons">
        <IconButton
          className="card-button"
          aria-label="delete"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          className="card-button"
          aria-label="delete"
          disabled={false}>
          <ListAltIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Paper>
  )
}

export default VirtCell