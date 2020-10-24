import React, { Fragment, useState, useRef, useEffect } from 'react'
import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import PollDrive from "../../modules/PollDrive";
import CityDialog from '../../components/CityDialog';
import { useQuery } from '@apollo/client'
import { useHistory } from "react-router-dom";
import { pollDataQuery, citiesQuery } from "./queries"
import { parseIni, normalizeLogic } from './lib/utils'

const DriveWrap = ({ id }) => {
  const mainDiv = useRef(null);
  const history = useHistory();
  const [poll, setPoll] = useState(null)
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
    fetch(`http://localhost:4000${filePath}`)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const ttt = normalizeLogic(logic)
        setPollLogic(ttt)
      })
  }

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
    history.push("/");
  }

  return (
    <Fragment>
      <div style={{ backgroundColor: currentQuestion.multiple ? 'rgb(208 226 252)' : '#fff' }}>
        <Container maxWidth="md">
          <CityDialog open={openCityDialog} cities={poolOfCities} save={saveCity} handleClose={closeDialog} />
          <PollDrive poll={poll} logics={logic} mainDiv={mainDiv} setCurrentQuestion={setCurrentQuestion} />
        </Container>
      </div>
    </Fragment>
  )
}

export default DriveWrap