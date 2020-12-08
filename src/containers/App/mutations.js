import { gql } from '@apollo/client';

export const SIGNIN_MUTATION = gql`
  mutation signin(
    $login: String!,
    $password: String!
  ) {
    signin(
      login: $login,
      password: $password
    ) {
      user {
        id
        login
      }
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation signup(
    $login: String!,
    $password: String!
  ) {
    signup(
      login: $login,
      password: $password
    ) {
      user {
        id
        login
      }
    }
  }

`