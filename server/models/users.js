const mongoose = require("mongoose")
const Schema = mongoose.Schema

const usersSchema = new Schema ({
    username: String,
    password: String,
    role: String,
    token: String,
    user: String
})

module.exports = mongoose.model('users', usersSchema)