import { gql } from '@apollo/client'

export const GET_POLL_DATA = gql`
  query($id: ID!) {
    poll(id: $id) {
      id
      title
      code
      liter
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
        topic {
          id
          title
        }
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

export const GET_QUESTIONS_WITH_SAME_TOPICS = gql`
  query($topics: [String!], $poll: String!) {
    sameQuestions(topics: $topics, poll: $poll) {
      id
      title
      topic {
        id
        title
      }
      poll {
        code
      }
      answers {
        id
        title
        code
        order
      }
    }
  }
`