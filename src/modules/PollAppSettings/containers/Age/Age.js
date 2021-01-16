import React, { Fragment, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import ConfirmDialog from '../../../../components/ConfirmDialog'

const Age = () => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, SetDelId] = useState(false)

  const Loading = () => {
    // if () return <LoadingStatus />
    return null
  }

  const handleDelConfirm = () => {
    return
  }

  const handleDelDialogClose = () => {
    return
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
      <div className="sex-service-zone">
        <Typography variant="h5" gutterBottom className="header">Возраст респондентов</Typography>
      </div>
      <Divider />
      <ConfirmDialog
        open={delId}
        confirm={handleDelConfirm}
        close={handleDelDialogClose}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Удалить"
        }}
        data={
          {
            title: 'Удалить категорию возраста?',
            content: 'Внимание! Результаты опросов учитывают возраст респондентов, удаление приведет к потере части статистики и некорректности ее отображения.'
          }
        }
      />
      <Grid container spacing={3} xs={12}>
      </Grid>
    </Fragment>
  )
}

export default Age