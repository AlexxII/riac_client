import { gql } from '@apollo/client'

export const saveNewLimit = gql`
mutation ($id: ID!, $limit: Int!) {
  newLimit(id: $id, limit: $limit) {
    id
    limit
  }
}
`
export const saveNewOrder = gql`
mutation ($questions: [ReorderedArray]) {
  newOrder(neworder: $questions) {
    id
    order
  }
}
`