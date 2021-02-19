import { gql } from '@apollo/client'

export const GET_AGE_CATEGORIES = gql`
query {
  ageCategoriesAll {
    id
    title
    order
    active
  }
}
`