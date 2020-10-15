const dbConfig = require("../config/db.config");
const Pool = require('pg').Pool

const connection = new Pool({
  connectionString: dbConfig.DB_URL,
})

module.exports = connection;