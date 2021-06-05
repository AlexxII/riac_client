import React, { Fragment, useEffect, useContext } from 'react'

import Button from '@material-ui/core/Button';

import AnalyzedQuestion from '../../components/AnalyzedQuestion'
import SimilarQuestion from '../../components/SimilarQuestion'
import EmptyState from '../../components/EmptyState'

import { SysnotyContext } from '../../../../../../containers/App/notycontext'
import errorHandler from '../../../../../../lib/errorHandler'

import { useLazyQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'

import { GET_QUESTION_RESULTS } from './queries'
import { SAVE_DISTRIBUTION } from './mutaions'

const MAX_VIEW = 5
const DISTRIBUTION_INPUT = 6

const QuestionAnalytic = ({ poll, question, allSimilar, setAllSimilar, emptyMessage, setQuestions }) => {
  const [setNoty] = useContext(SysnotyContext)

  const [getAnswersResults, { loading: answersResultsLoading, data: answersResultsData }] = useLazyQuery(GET_QUESTION_RESULTS, {
    onError: ({ graphQLErrors }) => {
      setNoty(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    }
  });

  const [saveQuestionDistribution, {
    loading: saveDistributionLoading
  }] = useMutation(SAVE_DISTRIBUTION, {
    onError: ({ graphQLErrors }) => {
      setNoty(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    },
    // update: (cache, { data }) => {
    //   if (data.addPoll) {
    //     // const { polls } = cache.readQuery({ query: GET_ALL_ACTIVE_POLLS })
    //     // cache.writeQuery({ query: GET_ALL_ACTIVE_POLLS, data: { polls: [...polls, data.addPoll] } })
    //     setNoty({
    //       type: 'success',
    //       text: 'Распределение сохранено'
    //     })
    //   }
    // }
  })

  useEffect(() => {
    if (answersResultsData && !answersResultsLoading) {
      const answers = answersResultsData.answersWithResults.answers
      // всего ответов
      const allResultsCount = answers.reduce((acum, item) => {
        acum += item.results.length
        return acum
      }, 0)
      // тип вопроса: 1 - один ответ, 2 - несколько ответов, 3 - только ввод ответа (один свободный ответ на вопрос)
      const qType = question.type
      let uAnswers = []
      //
      switch (qType) {
        case 1:
          uAnswers = answers.map(answer =>
          ({
            ...answer,
            distrib: answer.results.length ? (answer.results.length / allResultsCount * 100).toFixed(1) : 0
          }))
          break
        case 2:
          uAnswers = answers.map(answer =>
          ({
            ...answer,
            distrib: answer.results.length ? (answer.results.length / allResultsCount * 100).toFixed(1) : 0
          }))
          break
        case 3:
          uAnswers = answers.map(answer =>
          ({
            ...answer,
            distrib: answer.results.length ? (answer.results.length / allResultsCount * 100).toFixed(1) : 0
          }))
          break
        default:
          setNoty({
            text: "Неизвестный тип вопроса. Смотрите консоль"
          })
          console.log(`${qType} - этот тип вопроса указан в XML файле -> элемент <vopros> -> атрибут type_id. `)
      }
      const similarQuestionId = answersResultsData.answersWithResults.id
      setQuestions(prevState => {
        const uQuestions = prevState.map(item => {
          if (item.id === question.id) {
            return {
              ...item,
              similar: item.similar.map(item => {
                // обновляем тот самый похожий вопрос
                if (item.id === similarQuestionId) {
                  return {
                    ...item,
                    answers: uAnswers
                  }
                }
                return item
              })
            }
          }
          return item
        })
        return uQuestions
      })
    }
  }, [answersResultsData])


  const loadAnswers = (id) => {
    getAnswersResults({
      variables: {
        id
      }
    })
  }

  const setDistibution = (distrib) => {
    // если кол-во ответов не совпадает -> ручной ввод распределения
    if (distrib.count !== question.answers.length) {
      setNoty({
        type: 'error',
        text: 'Не совпадает кол-во ответов'
      })
      return
    }
    // получение индекса свободной колонки
    let freeIndex = null
    let exit = true
    for (let j = 0; j < DISTRIBUTION_INPUT; j++) {
      for (let i = 0; i < question.answers.length; i++) {
        if (question.answers[i].distribution[j]) {
          exit = false
          freeIndex = null
          break
        } else {
          freeIndex = j
          exit = true
        }
      }
      if (exit) break
    }
    if (freeIndex === null) setNoty({
      type: 'error',
      text: 'Нет свободых полей распределения.'
    })

    setQuestions(prevState => {
      const uQuestions = prevState.map(item => {
        if (item.id === question.id) {
          return {
            ...item,
            answers: item.answers.map((answer, index) => (
              {
                ...answer,
                distribution: {
                  ...answer.distribution,
                  [freeIndex]: {
                    data: distrib[index].distribution,
                    poll: distrib[index].poll.id,
                    answer: distrib[index].answerId,
                    type: 'new'
                  }
                }
              }
            ))
          }
        }
        return item
      })
      return uQuestions
    })
  }

  const handleManualInput = (value, column, row) => {
    setQuestions(prevState => {
      const uQuestions = prevState.map(item => {
        if (item.id === question.id) {
          return {
            ...item,
            answers: item.answers.map((answer, j) => {
              if (j === +row) {
                return {
                  ...answer,
                  distribution: {
                    ...answer.distribution,
                    [column]: value !== ''
                      ?
                      {
                        data: value,
                        poll: null,
                        answer: null
                      }
                      :
                      null
                  }
                }
              }
              return answer
            })
          }
        }
        return item
      })
      return uQuestions
    })
  }

  const handleSave = () => {
    const answers = question.answers
    setQuestions(prevState => (
      prevState.map(item => {
        if (item.id === question.id) {
          return {
            ...item,
            saved: true
          }
        }
        return item
      })
    ))
    const resultsAnswers = answers.map(answer => {
      const distribution = answer.distribution
      const distrib = []
      for (let index in distribution) {
        if (Object.hasOwnProperty.call(distribution, index) && distribution[index]) {
          distrib.push({
            id: distribution[index].id,
            data: distribution[index].data + '',
            refPoll: distribution[index].poll,
            refAnswer: distribution[index].answer,
            order: +index,
            type: distribution[index].type
          })
        }
      }
      return {
        id: answer.id,
        distribution: distrib
      }
    })

    saveQuestionDistribution({
      variables: {
        poll,
        answers: resultsAnswers
      }
    })
    // console.log(resultsAnswers);

    /*
    for (let i = 0; i < answers.length; i++) {
      const distribution = answers[i].distribution

      for (let index in distribution) {
        if (Object.hasOwnProperty.call(item, index)) {
          distrib.push({
            data: item[index].data,
            refPoll: item[index].poll,
            refAnswer: item[index].answer
          })
        }
      }
    }
    */
    // [{
    //   pollId: id,
    //   parent: answerId,
    //   refAnswer: similarAnswerId,
    //   refPoll: 
    //   order
    // }]
  }

  const handleSingleDel = (index) => {
    setQuestions(prevState => {
      const uQuestions = prevState.map(item => {
        if (item.id === question.id) {
          return {
            ...item,
            answers: item.answers.map((answer, i) => (
              {
                ...answer,
                distribution: {
                  ...answer.distribution,
                  [index]: null
                }
              }
            ))
          }
        }
        return item
      })
      return uQuestions
    })
  }

  const handleReset = () => {
    setQuestions(prevState => {
      const uQuestions = prevState.map(item => {
        if (item.id === question.id) {
          return {
            ...item,
            answers: item.answers.map((answer, index) => (
              {
                ...answer,
                distribution: {
                  '0': null,
                  '1': null,
                  '2': null,
                  '3': null,
                  '4': null,
                  '5': null
                }
              }
            ))
          }
        }
        return item
      })
      return uQuestions
    })
  }

  return (
    <Fragment>
      <AnalyzedQuestion
        question={question}
        handleReset={handleReset}
        handleManualInput={handleManualInput}
        handleSingleDel={handleSingleDel}
        handleSave={handleSave}
      />
      <div className="question-analytics">
        {question.similar &&
          question.similar.map((question, index) => {
            if (index < MAX_VIEW) {
              return (
                <SimilarQuestion loadAnswers={loadAnswers} key={question.id} question={question} setDistibution={setDistibution} />
              )
            }
          })
        }
        <div className="button-wrap">
          {question.similar?.length > 5
            ?
            <Button
              onClick={() => { allSimilar ? setAllSimilar(false) : setAllSimilar(true) }}
              variant="outlined">
              {
                allSimilar ?
                  `Свернуть`
                  :
                  `Еще + ${question.similar.length - MAX_VIEW}`
              }
            </Button>
            :
            <EmptyState emptyMessage={emptyMessage} />
          }
        </div>
        {question.similar && allSimilar &&
          question.similar.map((question, index) => {
            if (index >= MAX_VIEW) {
              return (
                <SimilarQuestion loadAnswers={loadAnswers} key={question.id} question={question} setDistibution={setDistibution} />
              )
            }
          })
        }
      </div>
    </Fragment>
  )
}
export default QuestionAnalytic
