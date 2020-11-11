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
  query filterSelects {
    cities {
      id
      title
      population
      category {
        label
      }
    }
  }
`

export const GET_POLL_RESULTS_EX = gql`
  query pollResults($id: String!) {
    pollResults(id: $id) {
      id
      city {
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