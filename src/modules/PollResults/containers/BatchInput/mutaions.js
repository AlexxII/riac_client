import { gql } from '@apollo/client'

export const SAVE_BATCH_RESULT = gql`
mutation ($poll: String!, $results: [BatchResults]) {
  saveBatchResults(
    poll: $poll,
    results: $results
  )
}
`