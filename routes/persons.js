var express = require('express');
var router = express.Router();
var Person = require('../models/Person');
var _ = require('lodash');
var {NotFound, BadRequest} = require('../errors/errors');
var HttpStatus = require('http-status-codes');

router.get('/all', async function (req, res, next) {
    try {
        const persons = await Person.query();
        // if (_.isUndefined(person)) {
        //     throw new NotFound('Person not found');
        // }
        res.status(HttpStatus.OK).json(persons);
    } catch (error) {
        next(error);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const person = await Person.query().findById(req.body.id);
        if (_.isUndefined(person)) {
            throw new NotFound('Person not found');
        }
        res.status(HttpStatus.OK).json(person);
    } catch (error) {
        next(error);
    }
});

router.post('/create', async function (req, res, next) {
    try {
        const newPerson = Person.fromJson(req.body);
        await Person.query().insert(newPerson);
        res.status(HttpStatus.CREATED).json(newPerson);
    } catch (error) {
        next(error);
    }
});

router.delete('/delete', async function (req, res, next) {
    try {
        const person = await Person.query().findById(req.body.id);
        if (_.isUndefined(person)) {
            throw new NotFound('Person not found');
        }
        await Person.query().deleteById(person.id)
        res.sendStatus(HttpStatus.OK);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
