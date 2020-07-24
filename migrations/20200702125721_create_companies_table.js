exports.up = function (knex) {

    return knex.schema.createTable('companies', function (table) {
        table.increments();
        table.string('name').notNullable().unique();
        table.timestamp('createdAt').defaultTo(knex.fn.now())
    })

};

exports.down = function (knex) {

    return knex.schema.dropTable('companies');

};
