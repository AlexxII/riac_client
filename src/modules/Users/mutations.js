import { gql } from '@apollo/client'

export const ADD_NEW_USER = gql`
  mutation($user: UserDataCreate!) {
    addNewUser(user: $user) {
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

export const UPDATE_USER = gql`
  mutation($id: String, $data: UserDataUpdate) {
    updateUser(id: $id, data: $data) {
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

export const DELETE_USERS = gql`
  mutation($users: [String]) {
    deleteUsers(users: $users) {
      id
    }
  }
`

export const RESET_PASSWORD = gql`
  mutation($id: String, $password: String) {
    resetPassword(id: $id, password: $password)
  }
`