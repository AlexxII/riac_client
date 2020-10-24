import { gql } from '@apollo/client';

export const GET_USER_INFO = gql`
  query GetActiveUser {
    activeUser @client {
      username
    }
  }
`;