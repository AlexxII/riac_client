import { gql } from '@apollo/client'

export const CHANGE_CATEGORY_STATUS = gql`
mutation ($id: String!, $status: Boolean!) {
  changeCityCategoryStatus(id: $id, status: $status) {
    id
    title
    order
    active
  }
}
`
export const SAVE_NEW_CATEGORY = gql`
mutation ($title: String!) {
  saveNewCityCategory(title: $title) {
    id
    title
    order
    active
  }
}
`
export const UPDATE_CATEGORY = gql`
mutation ($id: String!, $title: String!) {
  updateCityCategory(id: $id, title: $title) {
    id
    title
    order
    active
  }
}
`
export const CHANGE_CATEGORY_ORDER = gql`
mutation ($categories: [ItemsReorder]) {
  saveCityCategoryOrder(categories: $categories) {
    id
    order
  }
}
`
export const DELETE_CATEGORY = gql`
mutation($id: String!) {
  deleteCityCategory(id: $id) {
    id
    title
    order
    active
  }
}
`