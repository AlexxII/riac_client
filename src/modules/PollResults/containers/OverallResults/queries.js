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
    customFilters {
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
    filters {
      sex {
        id,
        code,
        active
      }
      age {
        id,
        code,
        active
      }
      custom {
        id,
        code,
        active
      }
    }
    results {
      id
      user {
        id
        username
      }
      created
      lastModified
      processed
      result {
        id
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
      }
    }
  }
}
`