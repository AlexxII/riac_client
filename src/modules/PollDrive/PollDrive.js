import React, { Fragment, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import Container from '@material-ui/core/Container'
import DriveLogic from "./components/DriveLogic";
import Button from '@material-ui/core/Button';
import ConfirmDialog from '../../components/ConfirmDialog';

import { SysnotyContext } from '../../containers/App/notycontext'

import DriveSettingsDialog from './components/DriveSettingsDialog'
import LoadingStatus from '../../components/LoadingStatus'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import FinishDialog from './components/FinishDialog';

import errorHandler from '../../lib/errorHandler'
import { parseIni, normalizeLogic } from './lib/utils'

import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client'

import { GET_POLL_DATA } from "./queries"
import { GET_ALL_ACTIVE_POLLS } from '../PollHome/queries'
import { GET_POLL_RESULTS } from '../PollResults/containers/OverallResults/queries'

import { SAVE_NEW_RESULT } from './mutaions'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const PollDrive = ({ pollId }) => {
  const [setNoti] = useContext(SysnotyContext);
  const [resetAll, setResetAll] = useState(false)
  const client = useApolloClient();
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
  const navigator = useNavigate();

  const [userSettings] = useState({
    stepDelay: 0,
    autoStep: true,                                                 // автоматический переход к другому вопросу
    cityAgain: false                                                // повтор вопроса с выбором города!!!!
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
  const [user, setUser] = useState(null)                                                        // пользователь, который проводил опрос
  const [cityCode, setCityCode] = useState(null)
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
  const [saveResult, { loading: saveLoading, data: saveResultData }] = useMutation(SAVE_NEW_RESULT, {
    onError: ({ graphQLErrors }) => {
      if (graphQLErrors.length) {
        setNoti(errorHandler(graphQLErrors))
        console.log(graphQLErrors);
      }
    },
    update: (cache, { data }) => {
      // возвращаемся
      setUserBack(true)
      const { polls } = cache.readQuery({ query: GET_ALL_ACTIVE_POLLS })
      const currentPoll = polls.filter(obj => obj.id === pollId)
      cache.modify({
        id: cache.identify(currentPoll[0]),
        fields: {
          resultsCount(previous) {
            return previous + 1
          }
        }
      })
      const { poll } = cache.readQuery({
        query: GET_POLL_RESULTS,
        variables: {
          id: pollId
        }
      })
      cache.modify({
        id: cache.identify(poll),
        fields: {
          results(previous, { toReference }) {
            return [...previous, toReference(data.saveResult)]
          }
        }
      })
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

  const saveCity = ({ city, user }) => {
    setCurrentCity(city)
    const configCities = logic.cities ? logic.cities : []
    let cityCode = ''
    if (configCities.length) {
      // сохраняем код выбранного города
      const activeCitiesCategories = data.cityCategories
      const selectedCityCategory = poolOfCities.filter(obj => obj.id === city.id).map(obj => obj.category.id)[0]
      for (let i = 0; i < activeCitiesCategories.length; i++) {
        if (activeCitiesCategories[i].id === selectedCityCategory) {
          cityCode = configCities[i] ? configCities[i] : ''
          break
        }
      }
    }
    setUser(user)
    setCityCode(cityCode)
    setOpenCityDialog(false)
  }

  const closeDialog = () => {
    setOpenCityDialog(false)
    navigator("/")
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
        user: user.id,
        driveinUser: currentUser.id,
        data: result
      }
    }).then(res => {
      navigator("/")
    })
  }

  const saveWorksheet = (data) => {
    const result = prepareResultData(data)
    saveResult({
      variables: {
        poll: poll.id,
        city: currentCity.id,
        user: user.id,
        driveinUser: currentUser.id,
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

  const handleResetConfirm = () => {
    // сброс всех результатов набиваемой анкеты
    setResetAll(false)
    let newResults = {}
    for (let key in results) {
      if (key !== 'pool') {
        if (results[key].count === 0) {
          newResults = {
            ...newResults,
            [key]: {
              ...results[key],
              data: []
            }
          }
        }
      } else {
        newResults = {
          ...newResults,
          pool: []
        }
      }
    }
    setResults(newResults)
    setCount(0)
    setFinish(false)
  }

  const FinishNode = () => {
    return <Button onClick={() => setFinishDialog(true)} variant="contained" size="small" className="control-button">Финиш</Button>
  }

  return (
    <Fragment>
      <ConfirmDialog
        open={resetAll}
        confirm={handleResetConfirm}
        close={() => { setResetAll(false) }}
        config={{
          closeBtn: "Отмена",
          confirmBtn: "Сбросить"
        }}
        data={
          {
            title: 'Сбросить результат?',
            content: `Внимание! Введенные данные будут сброшены.`
          }
        }
      />
      <FinishDialog open={finishDialog} handleClose={cancelFinish} finishAll={finishThisPoll} confirm={confirmFinish} />
      <Loading />
      <Container maxWidth="md">
        <DriveSettingsDialog
          open={openCityDialog}
          cities={poolOfCities}
          users={data.users}
          currentUser={currentUser}
          save={saveCity}
          handleClose={closeDialog}
        />
        <DriveLogic
          poll={poll}
          logic={logic}
          cityCode={cityCode}
          currentCity={currentCity}
          user={user}
          userSettings={userSettings}
          results={results}
          setResults={setResults}
          finish={finish}
          resetDriveResults={() => setResetAll(true)}
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