import { gql } from '@apollo/client'

export const GET_USER_SETTINGS = gql`
query {
  useSettings {
    id
    title
    order
    active
  }
}
`