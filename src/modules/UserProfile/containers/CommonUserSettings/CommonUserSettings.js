import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

const CommonUserSettings = () => {
  const [noti, setNoti] = useState(false)

  const Loading = () => {
    if (false === true)
      return (
        < LoadingState />
      )
    return null
  }

  return (
    <Fragment>
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <div className="category-service-zone">
        <Typography variant="h5" gutterBottom className="header">Общие настроки</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
        </Typography>
      </div>
      <Grid container spacing={3} xs={12}>
      </Grid>
    </Fragment>
  )
}

export default CommonUserSettings