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
        type
        topic {
          id
          title
        }
        answers {
          id
          title
          order
          code
          distribution {
            id,
            data
            order
          }
        }
      }
      logic {
        path
      }
    }
    questions {
      id
      title
      poll {
        id
        title
        code
      }
    }
  }
`

export const GET_QUESTIONS_WITH_SAME_TOPICS = gql`
  query($topics: [String!], $poll: String!) {
    sameQuestions(topics: $topics, poll: $poll) {
      id
      title
      type
      topic {
        id
        title
      }
      poll {
        id
        code
        title
        dateOrder
      }
    }
  }
`