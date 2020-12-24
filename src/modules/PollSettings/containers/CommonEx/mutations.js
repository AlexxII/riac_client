import { gql } from '@apollo/client'

export const SAVE_POLL_STATUS = gql`
mutation ($id: ID!, $active: Boolean!) {
  savePollStatus(id: $id, active: $active) {
    id
    title
    code
    liter
    questionsCount
    answersCount
    active
}
}
`