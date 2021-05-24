import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
      questions{
        id
        title
        limit
        order
        answers {
          id
          code
          title
        }
      }
      cities {
        id
        title
        category {
          id
          title
        }
      }
      logic {
        path
      }
    }
    cityCategories {
      id
    }
    users {
      id
      username
    }
  }
`