import { gql } from '@apollo/client'

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