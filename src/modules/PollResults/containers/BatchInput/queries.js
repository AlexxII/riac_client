import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query($id: ID!) {
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
          code
        }
      }
      logic {
        path
      }
    }
  }
`