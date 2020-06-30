var express = require('express');
var router = express.Router();
var Person = require('../models/Person');
var _ = require('lodash');

/* GET users listing. */
router.get('/', async function (req, res, next) {
    try {
        const person = await Person.query().findById(1);
        if (_.isUndefined(person)) {
            throw new Error('Person not found');
        }
        res.status(200).send(person);
    }
    catch(error) {
        next(error);
    }
});

module.exports = router;
