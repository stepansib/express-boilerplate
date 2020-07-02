const {Model, ValidationError} = require('objection');

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

    $beforeInsert(queryContext) {
        return this.customValidation();
    }

    customValidation() {
        return new Promise((resolve, reject) => {
            if (!this.email) {
                resolve();
            }
            Person.query().where("email", this.email).then((persons, error) => {
                if (persons.length === 0) {
                    resolve();
                } else {
                    reject(new ValidationError({
                        message: 'Person with email \'' + this.email + '\' already exists'
                    }));
                }
            });
        });
    }

    static get relationMappings() {
        const Company = require('./Company');

        return {
            company: {
                relation: Model.BelongsToOneRelation,
                modelClass: Company,
                join: {
                    from: 'persons.companyId',
                    to: 'companies.id'
                }
            },
        }
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['firstName', 'lastName'],

            properties: {
                id: {type: 'integer'},
                firstName: {type: 'string', minLength: 2, maxLength: 255},
                lastName: {type: 'string', minLength: 2, maxLength: 255},
                email: {type: 'string', minLength: 6},
            }
        };
    }
}

module.exports = Person;