import { gql } from '@apollo/client'

export const GET_ALL_ACTIVE_POLLS = gql`
  query {
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
      cities {
        id
        title
      }
    }
  }
`
