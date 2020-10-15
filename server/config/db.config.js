require('dotenv').config()
console.log("---- ",process.env.DB_USER)
module.exports = {
    DB_URL : process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`
};
