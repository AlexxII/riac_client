import { gql } from '@apollo/client'

export const DELETE_CITY_FROM_ACTIVE = gql`
  mutation ($id: ID!, $cities: [String]) {
    deleteCityFromActive(id: $id, cities: $cities) {
      id
      cities {
        id
      }
    }
  }
`
export const SET_ACTIVE_CITIES = gql`
  mutation ($id: ID!, $cities: [String]) {
    setPollCity(id: $id, cities: $cities) {
      id
      cities {
        id
      }
    }
  }
`