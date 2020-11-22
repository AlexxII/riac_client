import React, { Fragment, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from "array-move";

import QuestionCard from '../../components/QuestionCard'
import { pollQuery } from "./queries"
import { saveNewLimit, saveNewOrder } from "./mutations"

const ReoderEditor = ({ id }) => {
  const [questions, setQuestions] = useState(null)
  const [prevOrder, setPrevOrder] = useState(null)
  const { loading, error, data } = useQuery(pollQuery, {
    variables: { id },
    onCompleted: () => {
      const questions = data.poll.questions
      console.log(questions);
      setQuestions(questions.slice().sort((a, b) => (a.order > b.order) ? 1 : -1))
    }
  })
  const [saveLimit] = useMutation(saveNewLimit)
  const [saveOrder] = useMutation(saveNewOrder, {
    update: (cache, { data }) => {
      const questions = data.newOrder
      console.log(questions);
      for (let i = 0; i < questions.length; i++) {
        const id = questions[i].id
        const dd = cache.data.data
        for (let key in dd) {
          if (dd[key].id === id) console.log(dd[key]);
        }
      }
    }
  })

  if (loading || !questions) return (
    <Fragment>
      <CircularProgress />
      <p>Загрузка. Подождите пожалуйста</p>
    </Fragment>
  )

  if (error) return <p>Ошибка. Что-то пошло не так! :(</p>;

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
      <SortableList
        questions={questions}
        onSortEnd={onSortEnd}
        axis="xy"
      />
    </Fragment>
  )
}

export default ReoderEditor