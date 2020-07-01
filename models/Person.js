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

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['firstName', 'lastName'],

            properties: {
                id: { type: 'integer' },
                //parentId: { type: ['integer', 'null'] },
                firstName: { type: 'string', minLength: 2, maxLength: 255 },
                lastName: { type: 'string', minLength: 2, maxLength: 255 },
                email: { type: 'string', minLength: 6 },
            }
        };
    }
}

module.exports = Person;