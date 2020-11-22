import { gql } from '@apollo/client'

export const CITY_SAVE_MUTATION = gql`
mutation saveNewCity($title: String!, $population: Int!, $category: String!) {
  newCity(title: $title, population: $population, category: $category) {
    id
    title
    category
    population
  }
}
`

export const CITY_EDIT_SAVE = gql`
mutation saveCityEdit($id: String!, $title: String!, $population: Int!, $category: String!) {
  cityEdit(id: $id, title: $title, population: $population, category: $category) {
    id
    title
    category
    population
  }
}
`
export const DELETE_RESULTS = gql`
mutation ($results: [String]!) {
  deleteResults(results: $results) {
    id
  }
}
`