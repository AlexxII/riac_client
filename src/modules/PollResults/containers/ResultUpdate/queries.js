import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query ($id: ID!) {
    poll(id: $id) {
      id
      questions{
        id
        title
        limit
        order
        answers {
          id
          code
          title
        }
      }
      cities {
        id
        title
      }
      logic {
        path
      }
    }
  }
`

export const GET_RESPONDENT_RESULT = gql`
  query ($id: String!) {
    respondent(id: $id) {
      id
      result {
        id
        code
        text
        question {
          id
          order
          codesPool
        }
        answer {
          id
        }
      }
    }
  }
`