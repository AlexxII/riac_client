import { gql } from '@apollo/client'

export const saveConfigChanges = gql`
mutation saveConfigChanges($path: String!, $text: String!) {
  saveConfig(path: $path, text: $text)
}
`