import { gql } from '@apollo/client'

export const GET_POLL_RESULTS_BY_USERS = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
      title
      questions {
        id
        title
        order
        limit
        type
        answers {
          id
          title
          order
          code
          results {
            id
            code
            text
          }
        }
      }
    }
  }

`