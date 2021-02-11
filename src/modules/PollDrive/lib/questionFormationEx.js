import { keycodes } from './keycodes'

// режим - обновление, вколачивание

const questionFormationEx = (question, count, logic, results, setResults) => {
  let questionSuffix = {
    selectedAnswer: '',
    skip: false,
    multiple: question.limit > 1
  }
  let selectedIn = false
  let uniqueIn = false
  let uniqueSelected = false
  let keyCodesPool = []
  const codesPool = []
  // проверка на видимость ответа в перечне (ВНЕШНЯЯ ЛОГИКА - видимость)
  const visibleAnswers = logic.invisible ? question.answers.filter(answer => !logic.invisible.includes(answer.code))
    : question.answers
  // если пропущены все ответы, то пропускаем вопрос и выходим из функции
  if (!visibleAnswers.length) {
    return {
      skip: true
    }
  }

  const answersEx = visibleAnswers.map((answer, index) => {
    let answerSuffix = {
      selected: false,
      resultId: '',
      text: '',
      freeAnswer: false,
      disabled: false,
      focus: false,
      exclude: [],
      excludeM: ''
    }
    codesPool.push(answer.code)
    const exclude = logic.criticalExclude ? logic.criticalExclude : false
    if (exclude) {
      // заполняем поле exclude, в котором указаны все коды, которые будут исключены при выборе данного ответа
      for (let code in exclude) {
        if (code === answer.code) {
          answerSuffix = {
            ...answerSuffix,
            exclude: [...answerSuffix.exclude, ...exclude[code]]
          }
        }
        if (exclude[code].includes(answer.code)) {
          answerSuffix = {
            ...answerSuffix,
            exclude: [...answerSuffix.exclude, code]
          }
        }
      }
      // проверяем не исключен ли данный ответ кодами, которые указаны в поле exclude
      const lExclude = answerSuffix.exclude.length
      for (let j = 0; j < lExclude; j++) {
        const code = answerSuffix.exclude[j]
        if (results.pool.includes(code)) {
          answerSuffix = {
            ...answerSuffix,
            disabled: true,
            excludeM: `противоречит коду ${code}`
          }
        }
      }
    }

    // коды клавиатуры
    if (visibleAnswers.length > keycodes.length) {
      keyCodesPool[index] = [index, index + 1]
    } else {
      keyCodesPool[index] = keycodes[index][1]
      answerSuffix = {
        ...answerSuffix,
        showIndex: keycodes[index][0],
        keyCode: keycodes[index][1],
      }
    }

    // восстанавливаем ответы !
    if (results.pool.includes(answer.code)) {
      selectedIn = true
      answerSuffix = {
        ...answerSuffix,
        selected: true
      }
      questionSuffix = {
        ...questionSuffix,
        selectedAnswer: answer.id
      }
    }

    // проверка на блокировку ответа (ВНЕШНЯЯ ЛОГИКА - уникальность)
    if (logic.unique && logic.unique.includes(answer.code)) {
      uniqueIn = true
      answerSuffix = {
        ...answerSuffix,
        unique: true
      }
    }
    if (logic.unique && logic.unique.includes(answer.code) && results.pool.includes(answer.code)) uniqueSelected = true

    //проверка на свободные ответы
    if (logic.freeAnswers && logic.freeAnswers.includes(answer.code)) {
      answerSuffix = {
        ...answerSuffix,
        freeAnswer: true
      }
    }

    if (results[question.id]) {
      let data = results[question.id].data
      for (let i = 0; i < data.length; i++) {
        if (answer.code === data[i].answerCode && data[i].freeAnswerText !== '') {
          answerSuffix = {
            ...answerSuffix,
            freeAnswer: true,
            showFreeAnswer: true,
            text: data[i].freeAnswerText,
            focus: false
          }
        }
      }
    }

    return {
      id: answer.id,
      title: answer.title,
      code: answer.code,
      order: answer.order,
      ...answerSuffix
    }
  })

  const countSkipAnswers = answersEx.reduce((acum, answer) => {
    return acum + answer.disabled
  }, 0)

  if (countSkipAnswers === answersEx.length) {
    let newResultState = Object.assign({}, results);
    newResultState[question.id] = {
      data: [],
      codesPool,
      count
    }
    setResults(newResultState)
    return {
      skip: true,
      results: newResultState
    }
  }

  if (results[question.id] === undefined) {
    setResults(prevState => ({
      ...prevState,
      [question.id]: {
        data: [],
        codesPool,
        count
      }
    }))
  }

  // проверка сколько всего ответов в вопросе -> если много, то формируем multiple select
  if (visibleAnswers.length > keycodes.length) {
    questionSuffix = {
      ...questionSuffix,
      mega: true,
      megaMltp: question.limit
    }
  } else {
    questionSuffix = {
      ...questionSuffix,
      keyCodesPool
    }
  }

  // проверка на уникальность и исключаемость
  const newAnswers = answersEx.map(answer => {
    if (selectedIn) {
      if (uniqueIn) {
        if (uniqueSelected) {
          return answer.unique & answer.selected ? answer : { ...answer, disabled: true }
        } else {
          return answer.unique ? { ...answer, disabled: true } : answer
        }
      }
    }
    return answer
  })
  return {
    ...question,
    ...questionSuffix,
    answers: newAnswers
  }
}

export default questionFormationEx