import { gql } from '@apollo/client'

export const logicQuery = gql`
  query logicQuery($id: ID!) {
    pollLogic(id: $id) {
      id
      path
    }
  }
`