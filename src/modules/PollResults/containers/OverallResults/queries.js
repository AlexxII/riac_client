import { gql } from '@apollo/client'

export const GET_POLL_RESULTS = gql`
  query pollResults($id: String!) {
    pollResults(id: $id) {
      id
      poll {
        title
      }
      city {
        title
        category {
          label
        }
      }
      result {
        code
        text
      }
    }
  }

`