import { gql } from '@apollo/client'

export const ADD_NEW_POLL = gql`
  mutation ($newPoll: PollWithConfig!, $poolOfQuestions: [QuestionInput], $logic: LogicInput, $topic: [TopicInput]) {
    addPoll(poll: $newPoll, questions: $poolOfQuestions, logic: $logic, topic: $topic) {
      id
      title
      code
      liter
      color
      startDate
      endDate
      sample
      way
      type
      complete
      questionsCount
      answersCount
      active
      cities {
        id
        title
      }
    }
  }
`