import { gql } from '@apollo/client'

export const CHANGE_CATEGORY_STATUS = gql`
mutation ($id: String!, $status: Boolean!) {
  changeCategoryStatus(id: $id, status: $status) {
    id
    title
    order
    active
  }
}
`
export const SAVE_NEW_CATEGORY = gql`
mutation ($title: String!) {
  saveNewCategory(title: $title) {
    id
    title
    order
    active
  }
}
`
export const DELETE_CATEGORY =gql`
mutation ($id: String!) {
  deleteCityCategory(id: $id) {
    id
    title
    order
    active
  }
}
`