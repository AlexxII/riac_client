import { gql } from '@apollo/client'

export const GET_POLL_DATA_MIN = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
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
export const GET_POLL_DATA = gql`
  query ($id: ID!) {
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