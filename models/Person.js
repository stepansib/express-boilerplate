const { Model } = require('objection');

class Person extends Model {
    // Table name is the only required property.
    static get tableName() {
        return 'persons';
    }

    static get idColumn() {
        return 'id';
    }

    fullName() {
        return this.firstName + ' ' + this.lastName;
    }
}

module.exports = Person;