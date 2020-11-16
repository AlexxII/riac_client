import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
      questions{
        id
        title
        limit
        answers {
          id
          code
          title
        }
      }
      cities {
        id
        title
      }
      logic {
        path
      }
    }
  }
`