const mongoose = require("mongoose")
const Schema = mongoose.Schema

const classRoomSchema = new Schema ({
    name: {type: String, unique: true},
    state: String,
    students: Array,
    teachers: Array

})

module.exports = mongoose.model('classrooms', classRoomSchema)