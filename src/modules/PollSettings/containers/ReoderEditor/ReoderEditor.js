import React, { Fragment, useState } from 'react'

import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from "array-move";

import LoadingStatus from '../../../../components/LoadingStatus'
import SystemNoti from '../../../../components/SystemNoti'
import LoadingState from '../../../../components/LoadingState'
import ErrorState from '../../../../components/ErrorState'
import QuestionCard from '../../components/QuestionCard'
import { pollQuery } from "./queries"
import { saveNewLimit, saveNewOrder } from "./mutations"

const ReoderEditor = ({ id }) => {
  const [noti, setNoti] = useState(false)
  const [questions, setQuestions] = useState(null)
  const [prevOrder, setPrevOrder] = useState(null)
  const { loading: pollLoading, error: pollError, data } = useQuery(pollQuery, {
    variables: { id },
    onCompleted: () => {
      const questions = data.poll.questions
      console.log(questions);
      setQuestions(questions.slice().sort((a, b) => (a.order > b.order) ? 1 : -1))
    }
  })
  const [saveLimit, { loading: limitSaveLoading }] = useMutation(saveNewLimit, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить лимит не удалось. Смотрите консоль.'
      })
    }
  })
  const [saveOrder, { loading: saveOrderLoading }] = useMutation(saveNewOrder, {
    onError: (e) => {
      console.log(e);
      setNoti({
        type: 'error',
        text: 'Сохранить порядок не удалось. Смотрите консоль.'
      })
    },
    update: (cache, { data }) => {
      const questions = data.newOrder
      for (let i = 0; i < questions.length; i++) {
        const id = questions[i].id
        const dd = cache.data.data
        for (let key in dd) {
          if (dd[key].id === id) console.log(dd[key]);
        }
      }
    }
  })

  if (pollLoading || !questions) return (
    <LoadingState type="card" />
  )

  if (pollError) {
    console.log(JSON.stringify(pollError));
    return (
      <ErrorState
        title="Что-то пошло не так"
        description="Не удалось загрузить критические данные. Смотрите консоль"
      />
    )
  }

  const Loading = () => {
    if (limitSaveLoading || saveOrderLoading) return <LoadingStatus />
    return null
  }

  const handleLimitInput = (inputData) => {
    const id = inputData.id
    const limit = +inputData.limit
    setQuestions(questions.map(question => question.id === id ? { ...question, limit: limit } : question))
    saveLimit({
      variables: {
        id,
        limit
      }
    })
  }

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setPrevOrder({ ...questions })
    console.log(oldIndex, newIndex);
    if (oldIndex !== newIndex) {
      const newArray = arrayMove(questions, oldIndex, newIndex)
      let deltaArray = []
      const newOrder = newArray.reduce((acum, val, index) => {
        if (val.order === index + 1) {
          acum.push(val)
        } else {
          deltaArray.push({
            id: val.id,
            order: index + 1
          })
          acum.push({ ...val, order: index + 1 })
        }
        return acum
      }, [])
      setQuestions(newOrder)
      saveOrder({
        variables: {
          questions: deltaArray
        }
      })
    }
  };

  const SortableItem = SortableElement(({ question }) =>
    <QuestionCard question={question} handleLimitInput={handleLimitInput} />
  );

  const SortableList = SortableContainer(({ questions }) => {
    return (
      <Grid container item xs={12} spacing={2}>
        {questions.map((question, index) => (
          <SortableItem key={`item-${question.id}`} index={index} question={question} />
        ))}
      </Grid>
    );
  });

  return (
    <Fragment>
      <SystemNoti
        open={noti}
        text={noti ? noti.text : ""}
        type={noti ? noti.type : ""}
        close={() => setNoti(false)}
      />
      <Loading />
      <SortableList
        questions={questions}
        onSortEnd={onSortEnd}
        axis="xy"
      />
    </Fragment>
  )
}

export default ReoderEditor