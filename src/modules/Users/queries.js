import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query {
    protectedUsersInfo{
      id
      username
      login
      status {
        id
        title
      }
      rights {
        id
        title
      }
    }
  }
`

export const GET_AUTH_SELECTS = gql`
  query {
    userRights {
      id
      title
    }
    userStatus {
      id
      title
    }
  }
`