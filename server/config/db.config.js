require('dotenv').config()
export default {
    DB_URL : process.env.DATABASE_URL || `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}:${rocess.env.DB_PORT}/${process.env.DB_NAME}`
};