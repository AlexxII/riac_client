import { gql } from '@apollo/client';

export const SIGNIN_MUTATION = gql`
  mutation signin(
    $username: String!,
    $password: String!
  ) {
    signin(
      username: $username,
      password: $password
    ) {
      user {
        id
        username
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup(
    $username: String!,
    $password: String!
  ) {
    signup(
      username: $username,
      password: $password
    ) {
      user {
        id
        username
      }
    }
  }

`