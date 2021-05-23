import { gql } from '@apollo/client'

export const SAVE_DISTRIBUTION = gql`
mutation ($poll: String!, $answers: [AnswerDistribution]) {
  saveBatchResults(
    poll: $poll,
    answers: $answers
  ) {
    id
  }
}
`