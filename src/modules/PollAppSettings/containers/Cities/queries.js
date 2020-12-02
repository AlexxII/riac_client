import { gql } from '@apollo/client'

export const GET_CITITES_WITH_CATEGORIES = gql`
query {
  cities{
    id
    title
    population
    category {
      id
      title
    }
  }
  cityCategories{
    id
    title
  }
}
`