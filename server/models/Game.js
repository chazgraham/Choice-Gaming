const { Schema } = require('mongoose');

// This is a subdocument schema, it won't become its own model but we'll use it as the schema for the User's `savedGames` array in User.js

const gameSchema = new Schema ({

})

module.exports = gameSchema;