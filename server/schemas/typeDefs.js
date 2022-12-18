// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

    type User {
        _id: ID!
        username: String!
        email: String
        savedGames: [Game]
        friends: [User]
    }

    type Game {
        _id: ID
        name: String!
        background_image: String!
        gameId: String!
    }

    input GameInput {
        name: String!
        background_image: String!
        gameId: ID!
    }

    type Query {
        me: User
        users: [User]
        user(username: String!): User
    }

    type Mutation {
        login(email: String!, password: String!): Auth
        addUser(username: String!, email: String!, password: String!): Auth
        saveGame(game: GameInput): User
        addFriend(friendId: ID!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

// export the typeDefs
module.exports = typeDefs;