import { gql } from '@apollo/client'

export const GET_CUSTOM_FILTERS = gql`
query {
  customFilters {
    id
    title
    order
    active
  }
}
`