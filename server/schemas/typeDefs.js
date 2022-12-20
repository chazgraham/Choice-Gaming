// import the gql tagged template function
const { gql } = require('apollo-server-express');

// create our typeDefs
const typeDefs = gql`

    type User {
        _id: ID!
        username: String!
        email: String
        savedGames: [Game]
        wishlistGames: [Game]
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
        saveGame(gameToSave: GameInput!): User
        wishlist(gameToSave: GameInput!): User
        addFriend(friendId: ID!): User
        deleteGame(gameId: String!): User
        deleteWishlistGame(gameId: String!): User
    }

    type Auth {
        token: ID!
        user: User
    }
`;

// export the typeDefs
module.exports = typeDefs;