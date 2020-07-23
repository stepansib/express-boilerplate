const Winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');
const {v4: uuidV4} = require("uuid");
const _ = require("lodash");
var httpContext = require('express-http-context');

const createDefaultLogFieldsMiddleware = (req, res, next) => {
    httpContext.set('defaultMeta', {
        uuid: uuidV4(),
        originalUrl: req.originalUrl,
        path: req.path,
        method: req.method,
        requestBody: req.body
    });
    next();
};

const logRequestResponseMiddleware = (req, res, next) => {

    // Log request
    logger.info('Request');

    // Log response
    const startHrTime = process.hrtime();
    res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        logger.info('Response: ' + res.statusCode, {
            durationMs: Math.round(elapsedTimeInMs)
        });
    });

    next();
}

let processMeta = (meta) => {
    return _.merge(meta, httpContext.get('defaultMeta'))
};

const logger = {
    log: function (level, message, meta) {
        winston.log(level, message, processMeta(meta));
    },
    error: function (message, meta) {
        winston.error(message, processMeta(meta));
    },
    warn: function (message, meta) {
        winston.warn(message, processMeta(meta));
    },
    verbose: function (message, meta) {
        winston.verbose(message, processMeta(meta));
    },
    info: function (message, meta) {
        winston.info(message, processMeta(meta));
    },
    debug: function (message, meta) {
        winston.debug(message, processMeta(meta));
    },
    silly: function (message, meta) {
        winston.silly(message, processMeta(meta));
    }
};

const winston = Winston.createLogger({
    transports: [
        new Winston.transports.Console({
            handleExceptions: true,
            json: false,
        }),
        new ElasticsearchTransport.ElasticsearchTransport({
            index: 'express',
            handleExceptions: true,
            json: true,
            clientOpts: {
                node: 'http://elastic:changeme@localhost:9200'
            }
        })
    ],
});

module.exports = {
    logger: logger,
    logRequestResponseMiddleware: logRequestResponseMiddleware,
    createDefaultLogFieldsMiddleware: createDefaultLogFieldsMiddleware
};