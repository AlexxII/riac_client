import { gql } from '@apollo/client'

export const SAVE_BATCH_RESULT = gql`
mutation ($poll: String!, $user: String!, $city: String!, $results: [BatchResults]) {
  saveBatchResults(
    poll: $poll,
    user: $user,
    city: $city,
    results: $results
  )
}
`