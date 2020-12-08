import React, { Fragment, useState, useEffect } from 'react'
import { mainUrl } from "../../mainconfig";

import Container from '@material-ui/core/Container'
import CircularProgress from '@material-ui/core/CircularProgress'
import DriveLogic from "./components/DriveLogic";
import DialogWithSelect from '../../components/DialogWithSelect';
import Backdrop from '@material-ui/core/Backdrop';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from "react-router-dom";
import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client'

import { GET_POLL_DATA } from "./queries"

import { SAVE_NEW_RESULT } from './mutaions'
import { parseIni, normalizeLogic } from './lib/utils'

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const PollDrive = ({ id }) => {
  const client = useApolloClient();
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const { currentUser } = client.readQuery({
    query: gql`
    query CurrentUserQuery {
      currentUser {
        id
        username
      }
    }
    `,
  })
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
  const { pollLoading, error, data } = useQuery(GET_POLL_DATA, {
    variables: { id },
    onCompleted: (_, __) => {
      handleConfigFile(data.poll.logic.path)
      setPoolOfCities(data.poll.cities)
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
  const [saveResult] = useMutation(SAVE_NEW_RESULT)

  const handleMessageClose = () => {
    setMessage(prevState => ({
      ...prevState,
      show: false,
      text: ''
    }))
  }

  useEffect(() => {
    if (logic) {
      // применени очередности, если в настройках опроса меняли очередность
      const newOrderQuestion = data.poll.questions.slice().sort((a, b) => (a.order > b.order) ? 1 : -1)
      // исключение вопросов, ответы которых полностью исключены полем [invisible] ВНЕШНЕЙ ЛОГИКИ
      if (logic.invisible) {
        const invisiblePool = logic.invisible
        const visibleQuestions = newOrderQuestion.filter((question) => {
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
          questions: newOrderQuestion
        })
      }
    }
  }, [logic])

  if (!poll || !poolOfCities || !logic || !currentUser) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error) return <p>Error :(</p>;

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
              answer: answer.answerId,
              code: answer.answerCode,
              text: answer.freeAnswerText,
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
        user: currentUser.id,
        pool: data.pool,
        data: result
      }
    }).then(
      res => {
        setBackOpen(false)
        history.push("/")
      },
      error => {
        // сохранить результат не удалось -> сохранить его локально?!
        setBackOpen(false)
        setMessage({
          show: true,
          type: 'error',
          duration: 6000,
          text: 'Сохранить не удалось.'
        })
        console.log(error)
      }
    )
  }

  const saveWorksheet = (data) => {
    setBackOpen(true)
    const result = prepareResultData(data)
    saveResult({
      variables: {
        poll: poll.id,
        city: currentCity.id,
        user: currentUser.id,
        pool: data.pool,
        data: result
      }
    }).then(
      res => {
        setBackOpen(false)
      },
      error => {
        setBackOpen(false)
        setMessage({
          show: true,
          type: 'error',
          duration: 6000,
          text: 'Сохранить не удалось.'
        })
        console.log(error)
        console.log(data)
      }
    )
  }

  const Alert = (props) => {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <Fragment>
      <Backdrop className={classes.backdrop} open={backOpen}>
        <CircularProgress color="inherit" />
        <p>Подождите, сохранение результатов</p>
      </Backdrop>
      <div style={{ backgroundColor: currentQuestion.multiple ? 'rgb(208 226 252)' : '#fff' }}>
        <Container maxWidth="md">
          <DialogWithSelect
            open={openCityDialog}
            options={poolOfCities}
            header="Город"
            text="Выберите город в котором проводился опрос"
            save={saveCity}
            handleClose={closeDialog}
          />
          <DriveLogic
            poll={poll}
            logics={logic}
            setCurrentQuestion={setCurrentQuestion}
            saveAndGoBack={saveAndGoBack}
            saveWorksheet={saveWorksheet} />
        </Container>
      </div>
      <Snackbar open={message.show} autoHideDuration={message.duration} onClose={handleMessageClose}>
        <Alert onClose={handleMessageClose} severity={message.type}>
          {message.text}
        </Alert>
      </Snackbar>
    </Fragment>
  )
}

export default PollDrive