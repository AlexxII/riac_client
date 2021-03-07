import { gql } from '@apollo/client'


export const SAVE_FILTER_DATA = gql`
mutation ($poll: String, $data: FilterTypeInputEx) {
  savePollFilters(poll: $poll, data: $data) {
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
}
`