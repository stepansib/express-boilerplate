exports.up = function (knex) {
    return knex.schema.alterTable(`persons`, table => {
        table
            .foreign("companyId")
            .references("companies.id")
            .onDelete("SET NULL");
    });
};

exports.down = function (knex) {

};
