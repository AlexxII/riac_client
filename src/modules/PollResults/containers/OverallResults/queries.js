import { gql } from '@apollo/client'

export const GET_FILTER_SELECTS = gql`
  query {
    cities {
      id
      title
      population
      category {
        title
      }
    }
    intervievers {
      id
      username
    }
  }
`

export const GET_POLL_RESULTS = gql`
  query ($id: String!) {
    pollResults(id: $id) {
      id
      user {
        id
        username
      }
      city {
        id
        title
        category {
          title
        }
      }
      created
      lastModified
      processed
      result {
        question {
          id
          title
          answers {
            results {
              id
              code
            }
          }
        }
        answer
        code
        text
      }
    }
  }

`