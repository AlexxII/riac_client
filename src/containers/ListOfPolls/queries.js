import { gql } from '@apollo/client'

export const pollsQuery = gql`
  query pollsQuery {
    polls {
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