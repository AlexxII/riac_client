import React, { Fragment, useEffect, useState } from 'react'
import uuid from "uuid";

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'

import { useQuery } from '@apollo/client'

import { GET_POLL_DATA } from './queries'

import sample from 'alias-sampling'
import walker from 'walker-sample'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const Analytics = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [dataPool, setDataPool] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [displayData, setDisplayData] = useState(false)
  const [selectPool, setSelectPool] = useState([])
  const [selectAll, setSelectAll] = useState(false)
  const [activeWorksheets, setActiveWorksheets] = useState([])                          // отображаемые анкеты
  const [batchOpen, setBatchOpen] = useState(false)

  const {
    data: pollData,
    loading: pollDataLoading,
    error: pollDataError
  } = useQuery(GET_POLL_DATA, {
    variables: {
      id
    },
    onCompleted: () => {
      handleConfigFile(pollData.poll.logic.path)
    }
  });

  const handleConfigFile = (filePath) => {
    fetch(url + filePath)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const normLogic = normalizeLogic(logic)
        setLogic(normLogic)
      })
  }

  if (pollDataLoading) return (
    <LoadingState type="card" />
  )

  if (pollDataError) {
    console.log(JSON.stringify(pollDataError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (processing) return <LoadingStatus />
    return null
  }

  const calc = () => {
    const ITER = 600
    var s = sample(
      [0, 0.1, 0.5, 0.3, 0, 0.1],
      ['001', '002', '003', '004', '005', '006']
    );
    const tt = s.next(ITER);
    const mm = tt.reduce((acum, item) => {
      if (!acum[item]) {
        acum[item] = 1
      } else {
        acum[item] = acum[item] + 1
      }
      return acum
    }, {})
    let result = {}
    for (let key in mm) {
      const p = mm[key]
      const proc = (p / ITER) * 100
      result[key] = proc
    }
    console.log(result);
    return result
  }

  const calcEx = () => {
    const sampler = walker([
      [0.00000001, '001'],
      [0.1, '002'],
      [0.5, '003'],
      [0.3, '004'],
      [0.00000001, '005'],
      [0.1, '006']]);
    const rr = []
    const ITER = 600
    for (let i = 0; i < ITER; i++) {
      rr.push(sampler())
    }
    const mm = rr.reduce((acum, item) => {
      if (!acum[item]) {
        acum[item] = 1
      } else {
        acum[item] = acum[item] + 1
      }
      return acum
    }, {})
    let result = {}
    for (let key in mm) {
      // console.log(mm[key]);
      const p = mm[key]
      const proc = (p / ITER) * 100
      result[key] = proc
    }
    console.log(result);
    return result
  }

  const calcExEx = () => {
    const sam1 = calc()
    const sam2 = calcEx()
    let result = {}
    for (let key in sam1) {
      const pr1 = sam1[key]
      const pr2 = sam2[key]
      const mid = (pr1 + pr2) / 2
      result[key] = mid
    }
    console.log(result);
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
      <Grid
        container
        direction="column"
        justify="space-between"
        alignItems="flex-start"
      >
        <Button
          variant="contained"
          color="primary"
          onClick={calc}
        >
          Тест
          </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={calcEx}
        >
          Тест - 2
          </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={calcExEx}
        >
          Вместе
          </Button>
      </Grid>
    </Fragment>
  )
}

export default Analytics