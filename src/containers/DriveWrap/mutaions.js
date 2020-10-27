import { gql } from '@apollo/client'

export const saveNewResult = gql`
mutation saveResult($pollId: ID!, $city: ID!, $data: [String]) {
  saveResult(
    poll: $pollId,
    city: $city
    data: $data
  )
}
`