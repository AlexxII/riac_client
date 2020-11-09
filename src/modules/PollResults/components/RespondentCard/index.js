import React, { Fragment } from 'react'

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import ListAltIcon from '@material-ui/icons/ListAlt';
import Checkbox from '@material-ui/core/Checkbox';


const RespondentCard = ({ result, index, show, edit, selected, select }) => {
  return (
    <Fragment>
      <Paper className="respondent-card">
        <Grid container item justify="space-between">
          <Typography variant="h6" gutterBottom>
            {index + 1}
          </Typography>
          <Checkbox
            checked={selected}
            onChange={() => select(result.id)}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </Grid>
        <Typography variant="subtitle2" gutterBottom>
          н.п.: {result.city ? result.city.title : '-'}
        </Typography>
        <Typography variant="overline" display="block" gutterBottom>
          {result.city ? result.city.category.label : 'вероятно город стерли из БД'}
        </Typography>
        <Grid container item justify="space-between" className="card-service-buttons">
          <IconButton className="card-button" aria-label="delete" onClick={() => edit(result.id)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton className="card-button" aria-label="delete" onClick={() => show(result)}>
            <ListAltIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Paper>
    </Fragment>
  )
}

export default RespondentCard