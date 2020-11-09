import { gql } from '@apollo/client'

export const GET_CITITES_WITH_CATEGORIES = gql`
query {
  cities{
    id
    title
    population
    category {
      value
      label
    }
  }
  cityCategories{
    value
    label
  }
}
`