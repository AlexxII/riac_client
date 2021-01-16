import { gql } from '@apollo/client'

export const GET_FILTER_SELECTS = gql`
  query {
    intervievers {
      id
      username
    }
    status {
      value
      title
    }
    sex {
      value
      title
    }
    ageCategories {
      id
      title
    }
  }
`

export const GET_POLL_RESULTS = gql`
query ($id: ID!) {
  poll(id: $id) {
    id
    title
    code
    cities {
      id
      title
      population
      category {
        id
        order
        title
      }
    }
    logic {
      path
    }
    results {
      id
      user {
        id
        username
      }
      city {
        id
        title
        type
        category {
          order
          id
          title
        }
      }
      created
      lastModified
      processed
      result {
        answer
        code
        text
      }
    }
    questions {
      id
      title
      order
      limit
      type
      answers {
        id
        title
        order
        code
        results {
          id
          code
          text
          respondent {
            id
          }
        }
      }
    }
  }
}
`

export const GET_POLL_RESULTS_OLD = gql`
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
        answer
        code
        text
      }
    }
  }

`