import { gql } from '@apollo/client'

export const GET_AGE_CATEGORIES = gql`
query queryAgeCategory{
  ageCategoriesAll {
    id
    title
    order
    active
  }
}
`