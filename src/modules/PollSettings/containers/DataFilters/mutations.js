import { gql } from '@apollo/client'


export const SAVE_FILTER_DATA = gql`
mutation ($poll: String, $type: String, $data: [FilterTypeInput]) {
  savePollFilters(poll: $poll, type: $type, data: $data) {
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