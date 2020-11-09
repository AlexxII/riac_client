import { gql } from '@apollo/client'

export const logicQuery = gql`
  query logicQuery($id: ID!) {
    pollLogic(id: $id) {
      id
      path
    }
  }
`

export const saveConfigChanges = gql`
mutation saveConfigChanges($path: String!, $text: String!) {
  saveConfig(path: $path, text: $text)
}
`