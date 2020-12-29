import { gql } from '@apollo/client'

export const CITY_SAVE_MUTATION = gql`
mutation ($title: String!, $population: Int!, $category: String!) {
  newCity(title: $title, population: $population, category: $category) {
    id
    title
    category {
      id
      title
    }
    population
  }
}
`
export const CITY_SAVE_MULTIPLE_MUTATION = gql`
mutation ($cities: [CityInput]!) {
  newCities(cities: $cities) {
    id
    title
    category {
      id
      title
    }
    population
  }
}
`
export const CITY_EDIT_SAVE = gql`
mutation ($id: String!, $title: String!, $population: Int!, $category: String!) {
  cityEdit(id: $id, title: $title, population: $population, category: $category) {
    id
    title
    category {
      id
      title
    }
    population
  }
}
`
export const DELETE_CITY = gql`
mutation ($id: String!) {
  deleteCity(id: $id) {
    id
    title
    category {
      id
      title
    }
    population
  }
}
`