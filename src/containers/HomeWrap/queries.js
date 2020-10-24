import { gql } from '@apollo/client'

export const pollsQuery = gql`
  query pollsQuery {
    polls {
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
    }
  }
`
export const addNewPoll = gql`
  mutation addNewPoll($newPoll: PollWithConfig!, $poolOfQuestions: [QuestionInput], $logic: LogicInput, $topic: [TopicInput]) {
    addPoll(poll: $newPoll, questions: $poolOfQuestions, logic: $logic, topic: $topic) {
      title
    }
  }
`

export const deletePoll = gql`
  mutation deletePoll($id: ID!) {
    deletePoll(id: $id) {
      title
    }
  }
`