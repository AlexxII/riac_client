import { gql } from '@apollo/client'

export const DELETE_RESULTS = gql`
mutation ($results: [String]!) {
  deleteResults(results: $results) {
    id
  }
}
`
export const SAVE_RESULTS_STATUS = gql`
  mutation($results: [String]!, $type: String) {
    saveResultStatus(results: $results, type: $type) {
      id
      processed
    }
  }
`