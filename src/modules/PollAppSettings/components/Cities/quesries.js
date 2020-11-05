import { gql } from '@apollo/client'

export const GET_ALL_CITIES = gql`
  query citiesQuery{
    cities{
      id
      title
      order
      population
      category
    }
  }
`