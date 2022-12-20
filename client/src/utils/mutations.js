import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

export const SAVE_GAME = gql`
  mutation saveGame($gameToSave: GameInput!) {
    saveGame (gameToSave: $gameToSave) {
      _id
      username
      email
      savedGames {
        name
        background_image
        gameId
      }
    }
  }
`;

export const Delete_GAME = gql`
  mutation deleteGame($gameId: String!) {
    deleteGame (gameId: $gameId) {
      _id
      username
      email
      savedGames {
        name
        background_image
        gameId
      }
    }
  }
`;

export const ADD_FRIEND = gql`
  mutation addFriend($id: ID!) {
    addFriend(friendId: $id) {
      _id
      username
      friends {
        _id
        username
      }
    }
  }
`;

