require('dotenv').config();

module.exports = {
    appName: 'express-boilerplate',
    environment: process.env.NODE_ENV,
    database: {
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    }
}