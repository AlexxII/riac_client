import { gql } from '@apollo/client'

export const GET_ARCHIVE_POLLS = gql`
  query {
    archivePolls {
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
      resultsCount
      active
      cities {
        id
        title
      }
    }
  }
`
