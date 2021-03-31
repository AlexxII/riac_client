import React, { Fragment } from 'react'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import EditIcon from '@material-ui/icons/Edit'
import IconButton from '@material-ui/core/IconButton'
import ListAltIcon from '@material-ui/icons/ListAlt'
import Checkbox from '@material-ui/core/Checkbox'

const RespondentCard = ({ columnIndex, rowIndex }) => {

  return (
    <Fragment>
      <Paper className="respondent-card" style={{ 'margin': '5px' }}>
        {columnIndex + '  -  ' + rowIndex}
      </Paper>
    </Fragment>
  )
}

export default RespondentCard