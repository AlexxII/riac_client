import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query pollDatafromQuestionOrder($id: ID!) {
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
        topic {
          id
          title
        }
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