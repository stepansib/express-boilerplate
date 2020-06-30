var express = require('express');
var router = express.Router();
var Person = require('../models/Person');
var _ = require('lodash');
var {NotFound, BadRequest} = require('../errors/errors');
var HttpStatus = require('http-status-codes');

router.get('/', async function (req, res, next) {
    try {
        const person = await Person.query().findById(req.body.id);
        if (_.isUndefined(person)) {
            throw new NotFound('Person not found');
        }
        res.status(HttpStatus.OK).json(person);
    }
    catch(error) {
        next(error);
    }
});

router.post('/create', async function (req, res, next) {

});

module.exports = router;
