import { gql } from '@apollo/client'

export const ADD_NEW_POLL = gql`
  mutation addNewPoll($newPoll: PollWithConfig!, $poolOfQuestions: [QuestionInput], $logic: LogicInput, $topic: [TopicInput]) {
    addPoll(poll: $newPoll, questions: $poolOfQuestions, logic: $logic, topic: $topic) {
      title
    }
  }
`