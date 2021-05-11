import React, { Fragment, useEffect, useContext } from 'react'

import Button from '@material-ui/core/Button';

import AnalyzedQuestion from '../../components/AnalyzedQuestion'
import SimilarQuestion from '../../components/SimilarQuestion'
import EmptyState from '../../components/EmptyState'

import { SysnotyContext } from '../../../../../../containers/App/notycontext'
import errorHandler from '../../../../../../lib/errorHandler'

import { useLazyQuery } from '@apollo/client'
import { GET_QUESTION_RESULTS } from './queries'

const MAX_VIEW = 5

const QuestionAnalytic = ({ question, allSimilar, setAllSimilar, emptyMessage, setQuestions }) => {
  const [setNoti] = useContext(SysnotyContext)

  const [getAnswersResults, { loading: answersResultsLoading, data: answersResultsData }] = useLazyQuery(GET_QUESTION_RESULTS, {
    onError: ({ graphQLErrors }) => {
      setNoti(errorHandler(graphQLErrors))
      console.log(graphQLErrors);
    }
  });

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
            distrib: (answer.results.length / allResultsCount * 100).toFixed(1)
          }))
          break
        case 2:
          uAnswers = answers.map(answer =>
          ({
            ...answer,
            distrib: (answer.results.length / allResultsCount * 100).toFixed(1)
          }))
          break
        case 3:
        default:
        // setNoti()
      }
      const openedQuestionId = answersResultsData.answersWithResults.id
      setQuestions(prevState => {
        const uQuestions = prevState.map(item => {
          if (item.id === question.id) {
            return {
              ...item,
              similar: item.similar.map(item => {
                if (item.id === openedQuestionId) {
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
    console.log(distrib)
    console.log(question)
    let freeIndex = null

    if (distrib.count !== question.answers.length) {
      setNoti({
        type: 'error',
        text: 'Не совпадает кол-во ответов'
      })
      return
    }

    for (let i = 0; i < question.answers.length; i++) {
      const answer = question.answers[i];

      for (let key in answer.distribution) {
        if (!answer.distribution[key]) {
          freeIndex = key
          break
        }
      }
    }
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
                    poll: distrib[index].poll.code,
                    answer: distrib[index].answerId
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

  const handleManualInput = (value, index) => {
    console.log(value);
    console.log(index);
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
      console.log(uQuestions);
      return uQuestions
    })
  }

  return (
    <Fragment>
      <AnalyzedQuestion question={question} handleReset={handleReset} handleManualInput={handleManualInput} />
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
          {question.similar.length > 5
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
