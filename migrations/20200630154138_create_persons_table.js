
exports.up = function(knex) {
  return knex.raw(`CREATE TABLE express.persons (
        id INT auto_increment NOT NULL,
        firstName varchar(100) NOT NULL,
        lastName varchar(100) NOT NULL,
        email varchar(100) NULL,
        CONSTRAINT persons_pk PRIMARY KEY (id),
        CONSTRAINT persons_email UNIQUE KEY (email)
)
    ENGINE=InnoDB
    DEFAULT CHARSET=utf8
    COLLATE=utf8_general_ci;
`)
};

exports.down = function(knex) {
  
};
