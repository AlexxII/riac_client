import React, { Fragment, useState, useEffect, useContext } from 'react'

import Button from '@material-ui/core/Button';

import AnalyzedQuestion from '../../components/AnalyzedQuestion'
import SimilarQuestion from '../../components/SimilarQuestion'
import EmptyState from '../../components/EmptyState'

import { SysnotyContext } from '../../../../../../containers/App/notycontext'
import errorHandler from '../../../../../../lib/errorHandler'

import { useLazyQuery } from '@apollo/client'
import { GET_QUESTION_RESULTS } from './queries'

const MAX_VIEW = 5

const QuestionAnalytic = ({ question, simQuestions, allSimilar, setAllSimilar, emptyMessage, setQuestions }) => {
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
      console.log(question);
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
      console.log(uAnswers);
      setQuestions(prevState => {
        const uQuestions = prevState.map(item => {
          if (item.id === question.id) {
            return {
              ...item,
              similar: item.similar.map(item => ({
                ...item,
                answers: uAnswers
              }))
            }
          }
          return item
        })
        console.log(uQuestions);
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

  return (
    <Fragment>
      <AnalyzedQuestion question={question} />
      <div className="question-analytics">
        {simQuestions &&
          simQuestions.map((question, index) => {
            if (index < MAX_VIEW) {
              return (
                <SimilarQuestion loadAnswers={loadAnswers} key={question.id} question={question} />
              )
            }
          })
        }
        <div className="button-wrap">
          {simQuestions.length > 5
            ?
            <Button
              onClick={() => { allSimilar ? setAllSimilar(false) : setAllSimilar(true) }}
              variant="outlined">
              {
                allSimilar ?
                  `Свернуть`
                  :
                  `Еще + ${simQuestions.length - MAX_VIEW}`
              }
            </Button>
            :
            <EmptyState emptyMessage={emptyMessage} />
          }
        </div>
        {simQuestions && allSimilar &&
          simQuestions.map((question, index) => {
            if (index >= MAX_VIEW) {
              return (
                <SimilarQuestion loadAnswers={loadAnswers} key={question.id} question={question} />
              )
            }
          })
        }
      </div>
    </Fragment>
  )
}
export default QuestionAnalytic
