// Process env variables
const config = require('config');

const { knexSnakeCaseMappers } = require('objection');

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host : config.get('database.host'),
      user : config.get('database.user'),
      password : config.get('database.password'),
      database : config.get('database.name'),
      charset: 'utf8'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'migrations'
    },
    ...knexSnakeCaseMappers()
  },

};
