import { keycodes } from './keycodes'

// режим - обновление, вколачивание

const questionFormationEx = (question, poolOfResultsCodes, logic) => {
  let questionSuffix = {
    selectedAnswer: '',
    skip: false
  }
  let selectedIn = false
  let uniqueIn = false
  let uniqueSelected = false
  const answersEx = question.answers.map(answer => {
    const results = answer.results ? answer.results : []
    let answerSuffix = {
      selected: false,
      resultId: '',
      text: '',
      freeAnswer: false,
      disabled: false,
      skip: false,
      focus: false,
      exclude: [],
      excludeM: ''
    }
    // убираем невидимые вопросы
    if (logic.invisible && logic.invisible.includes(answer.code)) {
      answerSuffix = {
        ...answerSuffix,
        skip: true
      }
    }

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
        if (poolOfResultsCodes.includes(code)) {
          answerSuffix = {
            ...answerSuffix,
            disabled: true,
            excludeM: `противоречит коду ${code}`
          }
        }
      }
    }

    if (results.length) {
      const lResults = results.length
      for (let i = 0; i < lResults; i++) {
        if (poolOfResultsCodes.includes(results[i].code)) {
          answerSuffix = {
            ...answerSuffix,
            selected: true,
            resultId: results[i].id,
            text: results[i].text
          }
          questionSuffix = {
            ...questionSuffix,
            selectedAnswer: answer.id
          }
          selectedIn = true
          break
        }
      }
    } else {
      answerSuffix = {
        ...answerSuffix,
        selected: false
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
    if (logic.unique && logic.unique.includes(answer.code) && poolOfResultsCodes.includes(answer.code)) uniqueSelected = true

    //проверка на свободные ответы
    if (logic.freeAnswers && logic.freeAnswers.includes(answer.code)) {
      answerSuffix = {
        ...answerSuffix,
        freeAnswer: true
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
  // если все пропущены, то пропускаем ответ
  const disabledCount = answersEx.reduce((acum, item) => {
    return acum += item.skip ? 1 : 0
  }, 0)
  if (disabledCount === answersEx.length) {
    questionSuffix = {
      ...questionSuffix,
      skip: true
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