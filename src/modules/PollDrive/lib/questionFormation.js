import { keycodes } from './keycodes'

// формирует вопрос, на основании логики и ранее сохраненных результатов
const questionFormation = (poll, count, result, logic, setResults) => {
  const question = poll.questions[count]
  let keyCodesPool = []

  // проверка на видимость ответа в перечне (ВНЕШНЯЯ ЛОГИКА - видимость)
  const visibleAnswers = logic.invisible ? question.answers.filter(obj => !logic.invisible.includes(obj.code))
    : question.answers

  // если вопрос пропущен

  const exclude = logic.criticalExclude ? logic.criticalExclude : false
  let uniqueIn = false
  let selectedIn = false
  let uniqueSelected = false
  const newAnswers = visibleAnswers.map((answer, i) => {
    // надстройка для объекта - ответ
    let suffix = {
      freeAnswer: false,
      showFreeAnswer: false,
      freeAnswerText: '',
      focus: false,
      selected: false,
      disabled: false,
      exclude: [],
      excludeM: ''
    }
    // устанавливаем исключения
    if (exclude) {
      // заполняем поле exclude, в котором указаны все коды, которые будут исключены при выборе данного ответа
      for (let code in exclude) {
        if (code === answer.code) {
          suffix = {
            ...suffix,
            exclude: [...suffix.exclude, ...exclude[code]]
          }
        }
        if (exclude[code].includes(answer.code)) {
          suffix = {
            ...suffix,
            exclude: [...suffix.exclude, code]
          }
        }
      }
      // проверяем не исключен ли данный ответ кодами, которые указаны в поле exclude
      suffix.exclude.map(code => {
        if (result.pool.includes(code)) {
          suffix = {
            ...suffix,
            disabled: true,
            excludeM: `запрещен кодом ${code}`
          }
        }
      })
    }

    if (visibleAnswers.length > keycodes.length) {
      keyCodesPool[i] = [i, i + 1]
    } else {
      keyCodesPool[i] = keycodes[i][1]
      suffix = {
        ...suffix,
        showIndex: keycodes[i][0],
        keyCode: keycodes[i][1],
      }
    }
    // восстанавливаем ответы !
    if (result.pool.includes(answer.code)) {
      selectedIn = true
      suffix = {
        ...suffix,
        selected: true
      }
    }
    // проверка на блокировку ответа (ВНЕШНЯЯ ЛОГИКА - уникальность)
    if (logic.unique.includes(answer.code)) {
      uniqueIn = true
      suffix = {
        ...suffix,
        unique: true
      }
    }
    if (logic.unique.includes(answer.code) & result.pool.includes(answer.code)) uniqueSelected = true

    // проверка на свободный ответ (ВНЕШНЯЯ ЛОГИКА - свободный ответ)
    if (logic.freeAnswers.includes(answer.code)) {
      suffix = {
        ...suffix,
        freeAnswer: true,
        focus: true
      }
    }
    if (result[question.id]) {
      let data = result[question.id].data
      for (let i = 0; i < data.length; i++) {
        if (answer.code === data[i].answerCode && data[i].freeAnswerText !== '') {
          suffix = {
            ...suffix,
            freeAnswer: true,
            showFreeAnswer: true,
            freeAnswerText: data[i].freeAnswerText,
            focus: false
          }
        }
      }
    }
    const resultQ = { ...answer, ...suffix }
    return resultQ
  })

  // надстройка для объекта - вопрос
  let qSuffix = {
    mega: false,
    megaMltp: false,
    multiple: false                                      // много возможных ответов
  }

  if (question.limit > 1) {
    qSuffix = {
      ...qSuffix,
      multiple: true
    }
  }

  // проверка сколько всего ответов в вопросе -> если много, то формируем multiple select
  if (visibleAnswers.length > keycodes.length) {
    qSuffix = {
      ...qSuffix,
      mega: true,
      megaMltp: question.limit
    }
  } else {
    qSuffix = {
      ...qSuffix,
      keyCodesPool
    }
  }

  const countSkipAnswers = newAnswers.reduce((acum, answer) => {
    return acum + answer.disabled
  }, 0)

  if (countSkipAnswers === newAnswers.length) {
    setResults(prevState => ({
      ...prevState,
      [question.id]: {
        data: [],
        skip: true
      }
    }))
    return {
      next: true
    }
  }

  if (result[question.id] === undefined) {
    setResults(prevState => ({
      ...prevState,
      [question.id]: {
        data: [],
        skip: false
      }
    }))
  }

  // определение выбранных ответов и их уникальность для вопроса при восстановлении результатов
  const mAnswers = newAnswers.map((answer, index) => {
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
  }).map(answer => {
    if (exclude) {
      for (let code in exclude) {
        if (result.pool.includes(code)) {
          if (exclude[code].includes(answer.code)) {
            return { ...answer, disabled: true }
          }
          return answer
        }
      }

    }
    return answer
  })

  const data = {
    ...question,
    ...qSuffix,
    answers: mAnswers
  }

  return {
    next: false,
    data
  }
}

export default questionFormation