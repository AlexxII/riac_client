import { gql } from '@apollo/client'

export const DELETE_POLL = gql`
  mutation deletePoll($id: ID!) {
    deletePoll(id: $id) {
      title
    }
  }
`