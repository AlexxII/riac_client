import { gql } from '@apollo/client'

export const CHANGE_AGE_CATEGORY_STATUS = gql`
mutation ($id: String!, $status: Boolean!) {
  changeAgeCategoryStatus(id: $id, status: $status) {
    id
    title
    order
    active
  }
}
`
export const SAVE_NEW_CATEGORY = gql`
mutation ($title: String!) {
  saveNewAgeCategory(title: $title) {
    id
    title
    order
    active
  }
}
`
export const UPDATE_CATEGORY = gql`
mutation ($id: String!, $title: String!) {
  updateAgeCategory(id: $id, title: $title) {
    id
    title
    order
    active
  }
}
`
export const CHANGE_CATEGORY_ORDER = gql`
mutation ($ages: [ItemsReorder]) {
  saveAgeCategoryOrder(ages: $ages) {
    id
    order
  }
}
`
export const DELETE_CATEGORY = gql`
mutation($id: String!) {
  deleteAgeCategory(id: $id) {
    id
    title
    order
    active
  }
}
`