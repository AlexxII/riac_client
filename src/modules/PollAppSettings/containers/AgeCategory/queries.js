import { gql } from '@apollo/client'

export const GET_AGE_CATEGORIES = gql`
query {
  ageCategories {
    id
    title
    order
    active
  }
}
`