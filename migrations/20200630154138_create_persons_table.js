exports.up = function (knex) {

    return knex.schema.createTable('persons', function (table) {
        table.increments();
        table.string('firstName').notNullable();
        table.string('lastName').notNullable();
        table.string('email').unique();
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })

};

exports.down = function (knex) {

    return knex.schema.dropTable('persons');

};
