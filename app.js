'use strict';

// Process env variables
require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var knexConfig = require('./knexfile');
var knex = require('knex')(knexConfig[process.env.NODE_ENV]);
const { Model } = require('objection');
const { GeneralError } = require('./errors/errors');
var HttpStatus = require('http-status-codes');

// Give the knex instance to objection.
Model.knex(knex);

var indexRouter = require('./routes/index');
var personsRouter = require('./routes/persons');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req,res,next)=>{
  res.locals.hiddenMessage = 'Hola amigos!';
  res.locals.demoVariable = process.env.NODE_ENV;
  next();
});

app.use('/', indexRouter);
app.use('/persons', personsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {

  let code = err.status || HttpStatus.INTERNAL_SERVER_ERROR;
  if (err instanceof GeneralError) {
    code = err.getCode();
  }

  res.status(code).json({
    status: 'error',
    code: code,
    message: err.message,
  });

});

module.exports = app;
