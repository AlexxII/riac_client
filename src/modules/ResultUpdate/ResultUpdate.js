import React, { Fragment, useState, useEffect } from 'react'

import Container from '@material-ui/core/Container'
import DriveLogicEx from '../../modules/PollDrive/components/DriveLogicEx'
import { makeStyles } from '@material-ui/core/styles';

import LoadingStatus from '../../components/LoadingStatus'
import ErrorState from '../../components/ErrorState'
import LoadingState from '../../components/LoadingState'
import SystemNoti from '../../components/SystemNoti'

import { useHistory } from "react-router-dom";
import { gql, useApolloClient, useQuery, useMutation } from '@apollo/client'

import { GET_POLL_DATA, GET_RESPONDENT_RESULT } from "./queries"

import { SAVE_NEW_RESULT } from './mutaions'
import { parseIni, normalizeLogic } from '../../modules/PollDrive/lib/utils'

const productionUrl = process.env.REACT_APP_GQL_SERVER
const devUrl = process.env.REACT_APP_GQL_SERVER_DEV
const url = process.env.NODE_ENV !== 'production' ? devUrl : productionUrl

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const ResultUpdate = ({ pollId, respondentId }) => {
  const [noti, setNoti] = useState(false)
  const [message, setMessage] = useState({
    show: false,
    type: 'error',
    message: '',
    duration: 6000
  })
  const history = useHistory();
  const [count, setCount] = useState(0)
  const [userBack, setUserBack] = useState(false)
  const [finish, setFinish] = useState(false)
  const [finishDialog, setFinishDialog] = useState(false)

  const [userSettings] = useState({
    stepDelay: 100,
    autoStep: true,                    // автоматический переход к другому вопросу
    cityAgain: false                   // повтор вопроса с выбором города!!!!
  })

  const [poll, setPoll] = useState(null)
  const [poolOfCities, setPoolOfCities] = useState(null)
  const [logic, setPollLogic] = useState(null)
  const [results, setResults] = useState(
    {
      pool: []
    }
  )
  const { loading, error, data } = useQuery(GET_POLL_DATA, {
    variables: { id: pollId },
    onCompleted: (_, __) => {
      handleConfigFile(data.poll.logic.path)
      setPoolOfCities(data.poll.cities)
    }
  })

  const {
    data: pollResults,
    loading: pollResultsLoading,
    error: pollResultsError
  } = useQuery(GET_RESPONDENT_RESULT, {
    variables: {
      id: respondentId
    },
    onCompleted: () => {
      prepareSavedData(pollResults.respondent)
      // setActiveWorksheets(pollResults.poll.results)
      // handleConfigFileAndUpdateCache(pollResults.poll)
    }
  });

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

  // подготовить ранее сохраненные результаты
  const prepareSavedData = (data) => {
    const pool = data.result.map(result =>
      result.code
    )
    const dd = data.result.reduce((acum, item) => {
      acum[item.question.id] = {
        count: item.question.order,
        codesPool: item.question.codesPool,
        data: acum[item.question.id] ?
          [
            ...acum[item.question.id].data,
            {
              answerCode: item.code,
              answerId: item.answer.id,
              freeAnswer: item.text !== '',
              freeAnswerText: item.text
            }

          ]
          :
          [{
            answerCode: item.code,
            answerId: item.answer.id,
            freeAnswer: item.text !== '',
            freeAnswerText: item.text

          }]
      }
      return acum
    }, {})
    setResults({
      pool,
      ...dd
    })
    console.log(data);
    console.log(dd);
  }

  // const [saveResult, { loading: saveLoading }] = useMutation(SAVE_NEW_RESULT, {
  //   onError: (e) => {
  //     setNoti({
  //       type: 'error',
  //       text: 'Сохранить не удалось. Смотрите консоль.'
  //     })
  //   },
  //   refetchQueries: [{
  //     query: GET_POLL_RESULTS,
  //     variables: {
  //       id: pollId
  //     }
  //   }]
  // })
  // if (respondentId) {
  //   console.log(respondentId);
  // }

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
    // if (saveLoading) return <LoadingStatus />
    return null
  }

  if (!poll || !poolOfCities || !logic || pollResultsLoading) return (
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


  const saveAndGoBack = () => {

  }

  const saveWorksheet = () => {

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
      <Container maxWidth="md">
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
        />
      </Container>
    </Fragment>
  )
}

export default ResultUpdate