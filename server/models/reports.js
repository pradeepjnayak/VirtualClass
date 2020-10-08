const mongoose = require("mongoose")
const Schema = mongoose.Schema

const auditSchema = new Schema ({
    time : String,
    action : String,
    message: String,
    classId: String
})

module.exports = mongoose.model('reports', auditSchema)