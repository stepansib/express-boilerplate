const Person = require('../models/Person');
const {NotFound} = require('../errors/errors');
const _ = require('lodash');

class PersonRepository {

    static async getById(id) {
        const person = await Person.query().findById(id).withGraphFetched('company');
        if (!person) {
            throw new NotFound('Person not found');
        }
        return person;
    }

    static async getAll() {
        return Person.query().withGraphFetched('company');
    }

}

module.exports = PersonRepository;