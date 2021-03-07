import { gql } from '@apollo/client'

export const GET_CUSTOM_FILTERS = gql`
query {
  customFiltersAll {
    id
    title
    order
    active
  }
}
`