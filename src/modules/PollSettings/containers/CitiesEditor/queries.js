import { gql } from '@apollo/client'

export const GET_ALL_CITIES_AND_ACTIVE = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
      cities {
        id
        title
        population
        category {
          title
        }
      }
    }
    cities {
      id
      title
      category {
        title
      }
    }
  }
`