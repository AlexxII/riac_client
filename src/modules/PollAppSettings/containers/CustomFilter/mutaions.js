import { gql } from '@apollo/client'

export const SAVE_NEW_FILTER = gql`
mutation ($title: String!) {
  saveNewCustomFilter(title: $title) {
    id
    title
    order
    active
  }
}
`
export const UPDATE_FILTER = gql`
mutation ($id: String!, $title: String!) {
  updateCustomFilter(id: $id, title: $title) {
    id
    title
    order
    active
  }
}
`
export const CHANGE_FILTER_STATUS = gql`
mutation ($id: String!, $status: Boolean!) {
  changeCustomFilterStatus(id: $id, status: $status) {
    id
    title
    order
    active
  }
}
`
export const DELETE_FILTER = gql`
mutation($id: String!) {
  deleteCustomFilter(id: $id) {
    id
    title
    order
    active
  }
}
`
export const CHANGE_FILTERS_ORDER = gql`
mutation ($filters: [ItemsReorder]) {
  saveCustomFilterOrder(filters: $filters) {
    id
    order
  }
}
`