import { gql } from '@apollo/client'

export const CITY_SAVE_MUTATION = gql`
mutation saveNewCity($title: String!, $population: Int!, $category: String!) {
  newCity(title: $title, population: $population, category: $category) {
    id
    title
    category {
      value
      label
    }
    population
  }
}
`
export const CITY_EDIT_SAVE = gql`
mutation saveCityEdit($id: String!, $title: String!, $population: Int!, $category: String!) {
  cityEdit(id: $id, title: $title, population: $population, category: $category) {
    id
    title
    category {
      value
      label
    }
    population
  }
}
`
export const DELETE_CITY = gql`
mutation deleteCity($id: String!) {
  deleteCity(id: $id)
}
`