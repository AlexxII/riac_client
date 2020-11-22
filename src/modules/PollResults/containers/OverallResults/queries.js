import { gql } from '@apollo/client'

// export const GET_POLL_RESULTS = gql`
//   query pollResults($id: String!) {
//     pollResults(id: $id) {
//       id
//       poll {
//         title
//       }
//       city {
//         title
//         category {
//           label
//         }
//       }
//       result {
//         code
//         text
//       }
//     }
//   }
// `

export const GET_FILTER_SELECTS = gql`
  query {
    cities {
      id
      title
      population
      category {
        label
      }
    }
    intervievers {
      id
      username
    }
  }
`

export const GET_POLL_RESULTS = gql`
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
          label
        }
      }
      result {
        question {
          title
        }
        code
        text
      }
    }
  }

`