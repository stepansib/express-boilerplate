exports.up = function (knex) {
    return knex.raw(`
        CREATE TABLE express.companies (
        id INT auto_increment NOT NULL,
        name varchar(100) NOT NULL,
        CONSTRAINT companies_PK PRIMARY KEY (id),
        CONSTRAINT companies_UN UNIQUE KEY (name)
)
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8
    COLLATE=utf8_general_ci;
`)

};

exports.down = function (knex) {

};
