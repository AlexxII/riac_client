import { gql } from '@apollo/client'

export const pollsQuery = gql`
  query pollsQuery {
    pollInfo {
      id
      title
      code
      liter
      color
      startDate
      endDate
      sample
      way
      type
      complete
      questionsCount
      answersCount
      active
    }
  }
`