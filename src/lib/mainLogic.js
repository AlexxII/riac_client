const mainLogic = (trueCode, count, question, logic, setCount, setQuestion) => {
  const nextStep = {}
  const answers = question.newAnswers
  const limit = question.limit
  let cAnswers = answers.map((obj, i) => {
    if (obj.keyCode == trueCode) {
      return {
        ...obj,
        selected: true,
      }
    }
    return obj
  })
  setQuestion({ ...question, newAnswers: cAnswers })
  return nextStep
}
export default mainLogic