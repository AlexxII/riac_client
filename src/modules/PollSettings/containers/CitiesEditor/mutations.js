import { gql } from '@apollo/client'

export const DELETE_CITY_FROM_ACTIVE = gql`
  mutation deleteCityFromActive($id: String!) {
    deleteCityFromActive(id: $id)
  }
`

export const SET_ACTIVE_CITITES = gql`
  mutation setPollCity($id: String!) {
    setPollCity(id: $id) {
      id
    }
  }

`