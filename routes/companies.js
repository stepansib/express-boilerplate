var express = require('express');
var router = express.Router();
var Company = require('../models/Company');
var _ = require('lodash');
var {NotFound, BadRequest} = require('../errors/errors');
var HttpStatus = require('http-status-codes');

router.get('/all', async function (req, res, next) {
    try {
        res.status(HttpStatus.OK).json(await Company.query());
    } catch (error) {
        next(error);
    }
});

router.get('/all/eager', async function (req, res, next) {
    try {
        res.status(HttpStatus.OK).json(await Company.query().withGraphFetched({
            persons: true,
        }));
    } catch (error) {
        next(error);
    }
});

router.get('/', async function (req, res, next) {
    try {
        const company = await Company.query().findById(req.body.id);
        if (_.isUndefined(company)) {
            throw new NotFound('Company not found');
        }
        res.status(HttpStatus.OK).json(company);
    } catch (error) {
        next(error);
    }
});

router.post('/create', async function (req, res, next) {
    try {
        const newCompany = Company.fromJson(req.body);
        await Company.query().insert(newCompany);
        res.status(HttpStatus.CREATED).json(newCompany);
    } catch (error) {
        next(error);
    }
});

router.delete('/delete', async function (req, res, next) {
    try {
        const company = await Company.query().findById(req.body.id);
        if (_.isUndefined(company)) {
            throw new NotFound('Company not found');
        }
        await Company.query().deleteById(company.id)
        res.sendStatus(HttpStatus.OK);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
