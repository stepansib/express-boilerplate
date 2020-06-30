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

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
