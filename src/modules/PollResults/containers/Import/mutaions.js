import { gql } from '@apollo/client'

export const SAVE_BATCH_RESULT = gql`
mutation ($poll: String!, $results: [BatchResults]) {
  saveBatchResults(
    poll: $poll,
    results: $results
  ) {
    id
    user {
      id
      username
    }
    created
    lastModified
    processed
    city {
      id
      title
      type
      category {
        id
        order
        title
      }
    }
    result {
      id
      code
      text
    }
  }
}
`