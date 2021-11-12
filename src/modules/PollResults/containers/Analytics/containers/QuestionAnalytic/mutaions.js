import { gql } from '@apollo/client'

export const SAVE_DISTRIBUTION = gql`
mutation ($poll: String!, $answers: [AnswerDistribution]) {
  saveAnswersDistribution(
    poll: $poll,
    answers: $answers
  ) {
    id
  }
}
`