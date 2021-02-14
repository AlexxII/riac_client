import React, { Fragment, useState, useEffect } from 'react'

import Container from '@material-ui/core/Container'
import DriveLogicEx from "./components/DriveLogicEx";
import DialogWithSelect from '../../components/DialogWithSelect';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';

import LoadingStatus from '../../components/LoadingStatus'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import SystemNoti from '../../components/SystemNoti'

import FinishDialog from './components/FinishDialog';

import { Prompt } from 'react-router-dom'
import { useHistory } from "react-router-dom";
import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client'

import { GET_POLL_DATA } from "./queries"
import { GET_POLL_RESULTS } from '../PollResults/containers/OverallResults/queries'

import { SAVE_NEW_RESULT } from './mutaions'
import { parseIni, normalizeLogic } from './lib/utils'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const PollDrive = ({ pollId }) => {
  const [noti, setNoti] = useState(false)
  const client = useApolloClient();
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const { currentUser } = client.readQuery({
    query: gql`
    query {
      currentUser {
        id
        username
      }
    }
    `,
  })
  const history = useHistory();

  const [userSettings] = useState({
    stepDelay: 0,
    autoStep: true,                    // автоматический переход к другому вопросу
    cityAgain: false                   // повтор вопроса с выбором города!!!!
  })
  const [count, setCount] = useState(0)
  const [userBack, setUserBack] = useState(false)
  const [finish, setFinish] = useState(false)
  const [finishDialog, setFinishDialog] = useState(false)
  const [poll, setPoll] = useState(null)
  const [poolOfCities, setPoolOfCities] = useState(null)
  const [openCityDialog, setOpenCityDialog] = useState(true);
  const [logic, setPollLogic] = useState(null)
  const [results, setResults] = useState(
    {
      pool: []
    }
  )
  const [currentCity, setCurrentCity] = useState(null)
  const { loading, error, data } = useQuery(GET_POLL_DATA, {
    variables: { id: pollId },
    onCompleted: (_, __) => {
      handleConfigFile(data.poll.logic.path)
      setPoolOfCities(data.poll.cities)
    }
  })
  const handleConfigFile = (filePath) => {
    fetch(url + filePath)
      .then((r) => r.text())
      .then(text => {
        const logic = parseIni(text)
        // Нормализация ЛОГИКИ - здесь формируется ЛОГИКА опроса, на основании конфиг файла !!!
        const normLogic = normalizeLogic(logic)
        setPollLogic(normLogic)
      })
  }
  const [saveResult, { loading: saveLoading }] = useMutation(SAVE_NEW_RESULT, {
    onError: (e) => {
      setNoti({
        type: 'error',
        text: 'Сохранить не удалось. Смотрите консоль.'
      })
    },
    refetchQueries: [{
      query: GET_POLL_RESULTS,
      variables: {
        id: pollId
      }
    }],
    onCompleted: () => {
      setUserBack(true)
    }
  })

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

  const Loading = () => {
    if (saveLoading) return <LoadingStatus />
    return null
  }

  if (!poll || !poolOfCities || !logic || !currentUser) return (
    <LoadingState />
  )

  if (error) {
    console.log(JSON.stringify(error));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

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
    const result = prepareResultData(data)
    saveResult({
      variables: {
        poll: poll.id,
        city: currentCity.id,
        user: currentUser.id,
        pool: data.pool,
        data: result
      }
    }).then(res => {
      history.push("/")
    })
  }

  const saveWorksheet = (data) => {
    const result = prepareResultData(data)
    saveResult({
      variables: {
        poll: poll.id,
        city: currentCity.id,
        user: currentUser.id,
        pool: data.pool,
        data: result
      }
    })
    if (userSettings.cityAgain) {
      setOpenCityDialog(true)
    }
  }

  const confirmFinish = () => {
    // закончить данную анкету и начать новую, сбросив все данные
    saveWorksheet(results)
    setResults({
      pool: []
    })
    setCount(0)
    setFinish(false)
    setFinishDialog(false)
  }

  const finishThisPoll = () => {
    // закончить данный опрос и перейти на главную страницу
    setFinish(false)
    setFinishDialog(false)
    saveAndGoBack(results)
  }

  const cancelFinish = () => {
    // просто возврат к анкете, чтобы что-то поправить
    setFinishDialog(false)
  }

  const FinishNode = () => {
    return <Button onClick={() => setFinishDialog(true)} variant="contained" size="small" className="control-button">Финиш</Button>
  }

  return (
    <Fragment>
      <Prompt
        when={results.pool.length}
        message={() => {
          return userBack
            ? true
            : "Вы действительно хотите покинуть страницу ввода данных. Сохраненные данные будут потеряны!"
        }}
      />
      <FinishDialog open={finishDialog} handleClose={cancelFinish} finishAll={finishThisPoll} confirm={confirmFinish} />

      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <Container maxWidth="md">
        <DialogWithSelect
          open={openCityDialog}
          options={poolOfCities}
          header="Город"
          text="Выберите город в котором проводился опрос"
          save={saveCity}
          handleClose={closeDialog}
        />
        <DriveLogicEx
          poll={poll}
          logic={logic}
          userSettings={userSettings}
          results={results}
          setResults={setResults}
          finish={finish}
          setFinish={setFinish}
          setFinishDialog={setFinishDialog}
          count={count}
          setCount={setCount}
          finishNode={<FinishNode />}
        />
      </Container>
    </Fragment>
  )
}

export default PollDrive