import { gql } from "@apollo/client";

export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      friends {
        _id
        username
      }
      savedGames {
        name
        background_image
        gameId
      }
      wishlistGames {
        name
        background_image
        gameId
      }
      playedGames {
        name
        background_image
        gameId
      }
    }
  }
`;

export const QUERY_USERS = gql`
  query users {
    users {
      _id
      username
      email
      friends {
        _id
        username
      }
      savedGames {
        name
        background_image
        gameId
      }
      wishlistGames {
        name
        background_image
        gameId
      }
      playedGames {
        name
        background_image
        gameId
      }
    }
  }
`;

export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friends {
        _id
        username
      }
      savedGames {
        name
        background_image
        gameId
      }
      wishlistGames {
        name
        background_image
        gameId
      }
      playedGames {
        name
        background_image
        gameId
      }
    }
  }
`;