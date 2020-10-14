const { model } = require("mongoose");
const dbConfig = require("../config/db.config");
const Pool = require('pg').Pool

const connection = new Pool({
  connectionString: connectionString,
})

module.exports = connection;