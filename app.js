'use strict';

const config = require('config');
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig[config.get('environment')]);
const {Model, ValidationError} = require('objection');
const {GeneralError} = require('./errors/errors');
const HttpStatus = require('http-status-codes');
const {logger, createDefaultLogFieldsMiddleware, logRequestResponseMiddleware} = require('./services/logger');
const httpContext = require('express-http-context');
const indexRouter = require('./routes/index');
const personsRouter = require('./routes/persons');
const companiesRouter = require('./routes/companies');

var app = express();

// Initialize objection: give the knex instance to objection.
Model.knex(knex);

// Initialize view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Initialize request processing
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize logging
process.on('unhandledRejection', (reason, promise) => {
    throw reason;
})
app.use(httpContext.middleware);
app.use(createDefaultLogFieldsMiddleware);
app.use(logRequestResponseMiddleware);

// Initialize routes
app.use('/', indexRouter);
app.use('/persons', personsRouter);
app.use('/companies', companiesRouter);

// Initialize error handling
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

    logger.info('Handled exception: ' + err.message, {
        errorCode: code
    });

    res.status(code).json({
        status: 'error',
        code: code,
        message: err.message,
    });

});

module.exports = app;
