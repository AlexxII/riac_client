import { gql } from '@apollo/client'

export const deletePoll = gql`
  mutation deletePoll($id: ID!) {
    deletePoll(id: $id) {
      title
    }
  }
`