const express = require('express');
const router = express.Router();
const Person = require('../models/Person');
const _ = require('lodash');
const HttpStatus = require('http-status-codes');
const PersonRepository = require('../repository/person');

router.get('/', async function (req, res, next) {
    try {
        res.status(HttpStatus.OK).json(await PersonRepository.getAll());
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async function (req, res, next) {
    try {
        res.status(HttpStatus.OK).json(await PersonRepository.getById(req.params.id));
    } catch (error) {
        next(error);
    }
});

router.post('/create', async function (req, res, next) {
    try {
        const newPerson = Person.fromJson(req.body);
        await Person.query().insert(newPerson).withGraphFetched('company');
        res.status(HttpStatus.CREATED).json(newPerson);
    } catch (error) {
        next(error);
    }
});

router.delete('/delete', async function (req, res, next) {
    try {
        const person = await PersonRepository.getById(req.body.id);
        await Person.query().deleteById(person.id)
        res.sendStatus(HttpStatus.OK);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
