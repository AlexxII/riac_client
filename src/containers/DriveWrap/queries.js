import { gql } from '@apollo/client'

export const pollDataQuery = gql`
  query pollsQuery($id: ID!) {
    pollData(id: $id) {
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
    }
  }
`