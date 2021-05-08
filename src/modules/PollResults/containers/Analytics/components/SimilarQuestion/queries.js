import { gql } from '@apollo/client'

export const GET_QUESTION_RESULTS = gql`
  query($id: String!) {
    answersWithResults(id: $id) {
      id
      answers {
        id
        title
        code
        order
        results {
          id
          text
        }
      }
    }
  }
`