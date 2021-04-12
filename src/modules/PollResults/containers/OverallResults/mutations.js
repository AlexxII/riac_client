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

export const UPDATE_RESULT_CITY = gql`
  mutation($results: [String], $city: String) {
    updateResultCity(results: $results, city: $city) {
      id
      city {
        id
        title
        type
        category {
          id
          order
          title
        }
      }
    }
  }
`

export const UPDATE_RESULT_USER = gql`
  mutation($results: [String], $user: String) {
    updateResultUser(results: $results, user: $user) {
      id
      user {
        id
        username
      }
    }
  }
`