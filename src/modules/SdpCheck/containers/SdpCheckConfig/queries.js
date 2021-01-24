import { gql } from '@apollo/client'

export const GET_CITIES_CATEGORIES = gql`
query {
  cityCategories {
    id
    title
    order
    active
  }
}
`