import { gql } from '@apollo/client';

export const CURRENT_USER_QUERY = gql`
  query CurrentUserQuery {
    currentUser {
      id
      username
    }
  }
`;

export const GET_USER_INFO = gql`
  query GetActiveUser {
    activeUser @client {
      username
    }
  }
`;