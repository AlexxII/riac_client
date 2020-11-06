import React, { Fragment, useState, useEffect } from 'react'
import { mainUrl } from "../../mainconfig";

import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import PollDrive from "../../modules/PollDrive";
import CityDialog from '../../components/CityDialog';
import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';

import { useQuery, useMutation } from '@apollo/client'
import { useHistory } from "react-router-dom";
import { pollDataQuery, citiesQuery } from "./queries"
import { saveNewResult } from './mutaions'
import { parseIni, normalizeLogic } from './lib/utils'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const DriveWrap = ({ id }) => {
  const classes = useStyles();
  const history = useHistory();
  const [poll, setPoll] = useState(null)
  const [backOpen, setBackOpen] = useState(false)
  const [poolOfCities, setPoolOfCities] = useState(null)
  const [openCityDialog, setOpenCityDialog] = useState(true);
  const [logic, setPollLogic] = useState(null)
  const [currentCity, setCurrentCity] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState({
    'multiple': false
  })
  const { pollLoading, error, data } = useQuery(pollDataQuery, {
    variables: { id },
    onCompleted: (data) => {
      handleConfigFile(data.poll.logic.path)
    }
  })
  const handleConfigFile = (filePath) => {
    fetch(mainUrl + filePath)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const normLogic = normalizeLogic(logic)
        setPollLogic(normLogic)
      })
  }
  const [saveResult] = useMutation(saveNewResult)

  useEffect(() => {
    // исключение вопросов, ответы которых полностью исключены полем [invisible] ВНЕШНЕЙ ЛОГИКИ
    if (logic) {
      if (logic.invisible) {
        const invisiblePool = logic.invisible
        const visibleQuestions = data.poll.questions.filter((question) => {
          const answers = question.answers
          const lAnswers = answers.length
          let count = 0
          for (let i = 0; i < lAnswers; i++) {
            if (invisiblePool.includes(answers[i].code)) {
              count++
            }
          }
          if (count !== lAnswers) {
            return true
          }
          return false
        })
        setPoll({
          id: data.poll.id,
          questions: visibleQuestions
        })
      } else {
        setPoll({
          id: data.poll.id,
          questions: data.poll.questions
        })
      }
    }
  }, [logic])

  const { citiesLoading, cError, cData } = useQuery(citiesQuery, {
    onCompleted: (cData) => {
      setPoolOfCities(cData.cities)
    }
  })

  if (!poll || !poolOfCities || !logic) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error || cError) return <p>Error :(</p>;

  const saveCity = (city) => {
    setCurrentCity(city)
    setOpenCityDialog(false)
  }

  const closeDialog = () => {
    setOpenCityDialog(false)
    history.push("/")
  }

  const prepareResultData = (data) => {
    let result = []
    for (let key in data) {
      if (key !== 'pool') {
        result.push({
          id: key,
          data: data[key].data.map(answer => {
            return {
              code: answer.answerCode,
              text: answer.freeAnswerText
            }
          })
        })
      }
    }
    return result
  }

  const saveAndGoBack = (data) => {
    setBackOpen(true)
    const result = prepareResultData(data)
    saveResult({
      variables: {
        poll: poll.id,
        city: currentCity.id,
        user: '5f73207d34750a3be7865de7',
        pool: data.pool,
        data: result
      }
    })
    setBackOpen(false)
    // return setBackOpen(0)
    // history.push("/")
  }

  const saveWorksheet = (data) => {
    setBackOpen(true)
    const result = prepareResultData(data)
    saveResult({
      variables: {
        poll: poll.id,
        city: currentCity.id,
        user: '5f73207d34750a3be7865de7',
        pool: data.pool,
        data: result
      }
    })
    setBackOpen(false)
  }

  return (
    <Fragment>
      <Backdrop className={classes.backdrop} open={backOpen}>
        <CircularProgress color="inherit" />
        <p>Подождите, сохранение результатов</p>
      </Backdrop>
      <div style={{ backgroundColor: currentQuestion.multiple ? 'rgb(208 226 252)' : '#fff' }}>
        <Container maxWidth="md">
          <CityDialog open={openCityDialog} cities={poolOfCities} save={saveCity} handleClose={closeDialog} />
          <PollDrive poll={poll} logics={logic} setCurrentQuestion={setCurrentQuestion} saveAndGoBack={saveAndGoBack} saveWorksheet={saveWorksheet} />
        </Container>
      </div>
    </Fragment>
  )
}

export default DriveWrap