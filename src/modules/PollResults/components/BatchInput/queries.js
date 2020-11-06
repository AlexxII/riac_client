import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query pollQuery($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
      questionsCount
      answersCount
      questions {
        id
        title
        limit
        order
        answers {
          id
          title
          order
          code
        }
      }
      logic {
        path
      }
    }
  }
`