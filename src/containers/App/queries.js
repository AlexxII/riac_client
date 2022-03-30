import { gql } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query queryCurrentUser{
    currentUser {
      id
      username
      rights {
        id
        title
      }
    }
  }
`;