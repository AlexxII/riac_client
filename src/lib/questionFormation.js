import { keycodes } from './keycodes'

const driveLogic = () => {
  
}

// формирует вопрос, на основании логики и ранее сохраненных результатов

const questionFormation = (poll, count) => {
  const id = poll.pollData.questions[count].id
  const title = poll.pollData.questions[count].title
  const limit = poll.pollData.questions[count].limit
  const answers = poll.pollData.questions[count].answers
  const aLength = answers.length
  let newAnswers = answers.map((obj, i) => {
    let suffix = {
      showIndex: keycodes[i][0],
      keyCode: keycodes[i][1],
      freeAnswer: false,
      showFreeAnswer: false,
      focus: true,
      codeShow: true,
      selected: false
    }
    if (obj.code === '003') {
      suffix = {
        ...suffix,
        freeAnswer: true,
        showFreeAnswer: true,
        selected: false
      }
    }
    return {
      ...obj,
      ...suffix
    }
  })
  const data = { id, title, limit, newAnswers }
  return {
    next: false,
    data
  }
}

export default questionFormation