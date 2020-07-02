const {Model, ValidationError} = require('objection');

class Company extends Model {
    // Table name is the only required property.
    static get tableName() {
        return 'companies';
    }

    static get idColumn() {
        return 'id';
    }

    $beforeInsert(queryContext) {
        return this.validateName();
    }

    validateName() {
        return new Promise((resolve, reject) => {
            Company.query().where("name", this.name).then((companies, error) => {
                if (companies.length === 0) {
                    resolve();
                } else {
                    reject(new ValidationError({
                        message: 'Company with name \'' + this.name + '\' already exists'
                    }));
                }
            });
        });
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],

            properties: {
                id: {type: 'integer'},
                name: {type: 'string', minLength: 2, maxLength: 255},
            }
        };
    }
}

module.exports = Company;