import { gql } from '@apollo/client'

export const SAVE_NEW_RESULT = gql`
mutation ($poll: String!, $city: String!, $user: String!, $pool: [String], $data: [ResultData]) {
  saveResult(
    poll: $poll,
    city: $city,
    user: $user,
    pool: $pool,
    data: $data
  )
}
`

export const UPDATE_RESULT = gql`
mutation ($id: String!, $data: [ResultData]) {
  updateResult(
    id: $id,
    data: $data
  ) {
    id
    user {
      id
      username
    }
    created
    lastModified
    processed
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
    result {
      id
      code
      text
    }
  }
}
`