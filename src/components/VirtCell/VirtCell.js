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
          {index + 1}
        </Typography>
        <Typography variant="caption" display="block" gutterBottom>
          {respondent.id ? respondent.id.slice(-12) : ''}
        </Typography>
        <Checkbox
          color="primary"
          checked={selected}
          onChange={(e) => select({
            id: respondent.id,
            index,
            event: e
          })}
        />
      </Grid>
      <Typography variant="subtitle2" gutterBottom>
        н.п.: {respondent.city ? respondent.city.title : '-'}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        сохранен: {respondent.created ?? ''}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        обновлен: {respondent.lastModified ?? ''}
      </Typography>
      <Grid container item justify="space-between" className="card-service-buttons">
        <IconButton
          className="card-button"
          aria-label="delete"
          onClick={() => edit(respondent)}
          disabled={count > 1}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          className="card-button"
          aria-label="delete"
          onClick={() => show(respondent)}
          disabled={count > 1}>
          <ListAltIcon fontSize="small" />
        </IconButton>
      </Grid>
    </Paper>
  )
}

export default VirtCell