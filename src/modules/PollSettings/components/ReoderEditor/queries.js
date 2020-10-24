import { gql } from '@apollo/client'

export const pollQuery = gql`
  query pollQuery($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
      questions {
        id
        title
        limit
        order
        answers {
          id
          title
          order
        }
      }
    }
  }
`

export const saveNewLimit = gql`
mutation saveNewLimit($id: ID!, $limit: Int!) {
  newLimit(id: $id, limit: $limit)
}
`

export const saveNewOrder = gql`
mutation saveNewOrder($questions: [ReorderedArray]) {
  newOrder(neworder: $questions)
}
`