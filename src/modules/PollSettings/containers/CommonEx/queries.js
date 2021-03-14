import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
      questionsCount
      answersCount
      active
      questions {
        id
        title
        order
        topic {
          id
          title
        }
      }
    }
  }
`