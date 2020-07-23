'use strict';

// Process env variables
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var knexConfig = require('./knexfile');
var knex = require('knex')(knexConfig[process.env.NODE_ENV]);
const {Model, ValidationError} = require('objection');
const {GeneralError} = require('./errors/errors');
var HttpStatus = require('http-status-codes');
const Logger = require('./services/logger');

// Give the knex instance to objection.
Model.knex(knex);

var indexRouter = require('./routes/index');
var personsRouter = require('./routes/persons');
var companiesRouter = require('./routes/companies');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {

    // Log request
    Logger.info('Request', {
        method: req.method,
        originalUrl: req.originalUrl,
        path: req.path,
        requestBody: req.body,
        env: process.env.NODE_ENV
    });

    // Log response
    const startHrTime = process.hrtime();
    res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        Logger.info('Response', {
            durationMs: Math.round(elapsedTimeInMs)
        });
    });

    next();
});

app.use('/', indexRouter);
app.use('/persons', personsRouter);
app.use('/companies', companiesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {

    let code = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
    if (err instanceof GeneralError) {
        code = err.getCode();
    }

    if (err instanceof ValidationError) {
        code = HttpStatus.BAD_REQUEST;
    }

    Logger.error(err.message, {
        errorCode: code
    });

    res.status(code).json({
        status: 'error',
        code: code,
        message: err.message,
    });

});

module.exports = app;
