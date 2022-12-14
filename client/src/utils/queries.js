import { gql } from "@apollo/client";

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
    }
  }
`;

export const QUERY_USERS = gql`
  query users($username: String!) {
    users(username: $username) {
      _id
      username
      email
    }
  }
`;