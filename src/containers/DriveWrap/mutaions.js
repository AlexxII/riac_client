import { gql } from '@apollo/client'

export const saveNewResult = gql`
mutation saveResult($poll: String!, $city: String!, $user: String!, $pool: [String], $data: [ResultData]) {
  saveResult(
    poll: $poll,
    city: $city,
    user: $user,
    pool: $pool,
    data: $data
  )
}
`