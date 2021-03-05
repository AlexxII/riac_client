import { gql } from '@apollo/client'

export const GET_FILTER_SELECTS = gql`
  query {
    intervievers {
      id
      username
    }
    sex {
      id
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
        id
        answer {
          id
        }
        code
        text
        question {
          id
          order
          codesPool
        }
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