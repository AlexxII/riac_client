import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query {
    users {
      id
      username
      login
      status {
        value
        label
      }
      rights {
        value
        label
      }
    }
  }
`

export const GET_AUTH_SELECTS = gql`
  query {
    userRights {
      value
      label
    }
    userStatus {
      value
      label
    }
  }
`