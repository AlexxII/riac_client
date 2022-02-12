import { gql } from '@apollo/client'

export const GET_CITITES_WITH_CATEGORIES = gql`
query queryCitiesAndCategories{
  cities{
    id
    title
    population
    category {
      id
      title
    }
    type
  }
  cityCategories{
    id
    title
    active
  }
}
`