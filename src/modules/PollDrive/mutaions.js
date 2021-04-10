import { gql } from '@apollo/client'

export const SAVE_NEW_RESULT = gql`
mutation ($poll: String!, $city: String!, $user: String!, $data: [ResultData]) {
  saveResult(
    poll: $poll,
    city: $city,
    user: $user,
    data: $data
  )
}
`