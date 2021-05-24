import { gql } from '@apollo/client'

export const SAVE_NEW_RESULT = gql`
mutation ($poll: String!, $city: String!, $user: String!, $driveinUser: String!, $data: [ResultData]) {
  saveResult(
    poll: $poll,
    city: $city,
    user: $user,
    driveinUser: $driveinUser,
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