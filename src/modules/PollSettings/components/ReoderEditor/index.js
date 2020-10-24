import React, { Fragment, useState } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Grid from '@material-ui/core/Grid';
import { useQuery } from '@apollo/client'
import { useMutation } from '@apollo/react-hooks'
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import arrayMove from "array-move";

import QuestionCard from '../QuestionCard'
import { pollQuery, saveNewLimit, saveNewOrder } from "./queries"


const ReoderEditor = ({ id }) => {
  const [questions, setQuestions] = useState(null)
  const [prevOrder, setPrevOrder] = useState(null)
  const { loading, error, data, refetch } = useQuery(pollQuery, {
    variables: { id },
    onCompleted: () => setQuestions(data.poll.questions)
  })
  const [saveLimit] = useMutation(saveNewLimit, {
    // TODO: refetchQueries -> Обновить PollDrive cache!!!

    // onCompleted: (answer) => console.log(answer)
    // TODO: "При ОШИБКЕ -> оповещения и восстановления!"
  })
  const [saveOrder] = useMutation(saveNewOrder, {
    // TODO: refetchQueries -> Обновить PollDrive cache!!!

    // onCompleted: (answer) => console.log(answer)
    // TODO: "При ОШИБКЕ -> оповещения и восстановления!"
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
    saveOrder({
      variables: {
        questions: deltaArray
      }
    })
    setQuestions(newOrder)
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