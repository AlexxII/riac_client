import React, { Fragment, useEffect, useState } from 'react'

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import LinearTable from '../../components/LinearTable'
import BarChart from '../../components/BarChart'

import ConfirmDialog from '../../../../components/ConfirmDialog'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'
import { parseOprFile } from '../../lib/utils'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_DATA } from './queries'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const BatchInput = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState()
  const [delId, setDelId] = useState(false)
  const [dataPool, setDataPool] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [displayData, setDisplayData] = useState(false)

  // useEffect(() => {
  //   if (dataPool) {
  //     const poll = pollData ? pollData.poll : null
  //     if (poll) {
  //       const questions = poll.questions
  //       const resultPoolLength = dataPool.length
  //       // пройтись по невидимым сперва
  //       const newQuestionsPool = questions.map(question => {
  //         const newAnswersPool = question.answers.map(answer => {
  //           let temp = [...answer.results]
  //           for (let i = 0; i < resultPoolLength; i++) {
  //             if (dataPool[i].includes(answer.code)) {
  //               temp.push({
  //                 code: answer.code,
  //                 text: ''
  //               })
  //             }
  //           }
  //           return {
  //             ...answer,
  //             results: temp
  //           }
  //         })
  //         return {
  //           ...question,
  //           answers: newAnswersPool
  //         }
  //       })
  //       setDisplayData(newQuestionsPool)
  //     }
  //   }
  // }, [dataPool])

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

  const handleWarInput = (e) => {
    e.preventDefault()
    if (!e.target.files[0]) return
    setProcessing(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    if (file) {
      reader.onloadend = () => {
        // + удаляем перенос строк
        const fileData = reader.result
        const correctData = parseOprFile(fileData)

        // const oprTextRaw = reader.result.replace(/\r?\n/g, "")
        // const oprArrayRaw = oprTextRaw.split(',999')
        // console.log(oprTextRaw);
        // const oprArray = oprArrayRaw.filter(arr => arr.length)
        // const aLength = oprArray.length
        // let splitedCodesArrays = []
        // for (let i = 0; i < aLength; i++) {
        //   const tempAr = oprArray[i].split(',')
        //   const tempLength = tempAr.length
        //   let normTemp = []
        //   for (let j = 0; j < tempLength; j++) {
        //     const atomData = tempAr[j]
        //     normTemp.push(atomData.trim())
        //   }
        //   splitedCodesArrays.push(normTemp)
        // }
        // setDataPool(splitedCodesArrays)
        // setProcessing(false)
        setProcessing(false)
      }
    }
    reader.readAsText(file, 'cp866');
    e.target.value = ""
  }

  if (pollDataLoading) return (
    <LoadingState type="card" />
  )

  const handleDelConfirm = () => {

  }

  const handleDelDialogClose = () => {

  }

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

  return (

    <Fragment>
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <div className="batchinput-service-zone">
        <Typography variant="h5" gutterBottom className="header">Пакетный ввод данных</Typography>
      </div>
      <Divider />
      <div className="info-zone">
        <Typography variant="body2" gutterBottom>
          Подгрузите данные в формате кодов.
        </Typography>
      </div>
      <div className="bachinput-add-zone">
        <input
          accept="*.opr"
          id="contained-button-file"
          onInput={handleWarInput}
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            color="primary"
            component="span"
            size="small"
          >
            Выбрать
        </Button>
        </label>
      </div>
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
            title: 'Удалить результат?',
            content: `Внимание! Результаты опросов учитывают возраст респондента, удаление приведет к потере части статистики и некорректности ее отображения.`
          }
        }
      />
      <Grid container spacing={3} xs={12} className="batchinput-result-zone">
        {displayData
        }
      </Grid>
    </Fragment>
  )
}

export default BatchInput