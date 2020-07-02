exports.up = function (knex) {

    return knex.schema.alterTable(`persons`, table => {
        // table
        //     .foreign("companyId")
        //     .references("companies.id")
        //     .onDelete("SET NULL");

        table
            .integer('companyId').unsigned().nullable()
            .references('companies.id')
            .onDelete('SET NULL');
    });

};

exports.down = function (knex) {

    return knex.schema.table(`persons`, table => {
        table.dropForeign('companyId');
        table.dropColumn('companyId');
    });

};
