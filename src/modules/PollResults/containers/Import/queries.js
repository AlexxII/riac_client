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

export const GET_POLL_DATA = gql`
  query($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
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
      questions {
        id
        title
        limit
        order
        answers {
          id
          title
          order
          code
        }
      }
      logic {
        path
      }
    }
  }
`