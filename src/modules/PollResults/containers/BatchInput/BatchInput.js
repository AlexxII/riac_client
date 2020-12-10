import React, { Fragment, useEffect, useState } from 'react'
import { mainUrl } from "../../../../mainconfig";

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingStatus from '../../../../components/LoadingStatus'

import LinearTable from '../../components/LinearTable'
import BarChart from '../../components/BarChart'

import { parseIni, normalizeLogic } from '../../../../modules/PollDrive/lib/utils'

import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_POLL_DATA } from './queries'

const BatchInput = ({ id }) => {
  const [dataPool, setDataPool] = useState(false)
  const [logic, setLogic] = useState(false)
  const [processing, setProcessing] = useState(false)

  const [displayData, setDisplayData] = useState(false)

  useEffect(() => {

    if (dataPool) {
      const poll = pollData ? pollData.poll : null
      if (poll) {
        const questions = poll.questions
        const resultPoolLength = dataPool.length
        // пройтись по невидимым сперва

        const newQuestionsPool = questions.map(question => {
          const newAnswersPool = question.answers.map(answer => {
            let temp = [...answer.results]
            for (let i = 0; i < resultPoolLength; i++) {
              if (dataPool[i].includes(answer.code)) {
                temp.push({
                  code: answer.code,
                  text: ''
                })
              }
            }
            return {
              ...answer,
              results: temp
            }
          })
          return {
            ...question,
            answers: newAnswersPool
          }
        })
        setDisplayData(newQuestionsPool)
        console.log(newQuestionsPool);
      }
    }
  }, [dataPool])

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
      console.log(pollData);
    }
  });

  const handleConfigFile = (filePath) => {
    fetch(mainUrl + filePath)
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
        const oprTextRaw = reader.result.replace(/\r?\n/g, "")
        const oprArrayRaw = oprTextRaw.split(',999')
        const oprArray = oprArrayRaw.filter(arr => arr.length)
        const aLength = oprArray.length
        let splitedCodesArrays = []
        for (let i = 0; i < aLength; i++) {
          const tempAr = oprArray[i].split(',')
          const tempLength = tempAr.length
          let normTemp = []
          for (let j = 0; j < tempLength; j++) {
            const atomData = tempAr[j]
            normTemp.push(atomData.trim())
          }
          splitedCodesArrays.push(normTemp)
        }
        setDataPool(splitedCodesArrays)
        setProcessing(false)
      }
    }
    reader.readAsText(file);
    e.target.value = ""
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

  return (
    <Fragment>
      <Loading />
      <p> Пакетный ввод данных</p>
      <Grid container spacing={3} xs={12}>
        <Grid item xs={12}>
          <Box>
            <label>Подгрузите файл с результатами</label>
            <br />
            <input
              type="file"
              onInput={handleWarInput}
            />
          </Box>
        </Grid>
        {displayData &&
          displayData.map((question, index) => (
            <Fragment>
              <Grid xs={12} md={6}>
                <LinearTable index={index} key={question.id} question={question} />
                <p></p>
              </Grid>
              <Grid xs={12} md={6}>
                <BarChart question={question} />
                <p></p>
              </Grid>
            </Fragment>
          ))}
      </Grid>
    </Fragment>
  )
}

export default BatchInput