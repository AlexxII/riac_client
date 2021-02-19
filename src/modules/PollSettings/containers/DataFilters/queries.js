import { gql } from '@apollo/client'

export const pollQuery = gql`
  query pollQuery($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
      questions {
        id
        title
        limit
        order
        answers {
          id
          title
          order
        }
      }
    }
  }
`
export const GET_POLL_AND_ALL_FILTERS = gql`
  query getFilterQuery($id: ID!) {
    poll(id: $id) {
      filters {
        sex {
          id
        }
        age {
          id
        }
        custom {
          id
        }
      }
    }
    ageCategories {
      id
      title
      order
    }
    sex {
      id
      title
      order
    }
    customFilters {
      id
      title
      order
    }
  }
`
