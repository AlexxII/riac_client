import { gql } from '@apollo/client'

export const GET_CITIES_CATEGORIES = gql`
query queryCityCategory{
  cityCategoriesAll {
    id
    title
    order
    active
  }
  cityCategories {
    id
    title
    order
    active
  }
}
`