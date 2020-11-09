import { gql } from '@apollo/client'

export const GET_POLL_DATE = gql`
  query pollsQuery($id: ID!) {
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
      logic {
        path
      }
    }
  }
`

export const GET_ACTIVE_CITITES = gql`
  query citiesQ {
    cities {
      id
      title
    }
  }
`