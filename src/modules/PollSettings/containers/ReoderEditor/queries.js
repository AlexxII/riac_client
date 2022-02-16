import { gql } from '@apollo/client'

export const pollQuery = gql`
  query queryPollForReoder($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
      questions {
        id
        title
        limit
        order
        answers {
          id
          title
          order
        }
      }
    }
  }
`
