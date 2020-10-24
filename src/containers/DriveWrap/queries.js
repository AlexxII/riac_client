import { gql } from '@apollo/client'

export const pollDataQuery = gql`
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

export const citiesQuery = gql`
  query citiesQ {
    cities {
      id
      title
    }
  }
`