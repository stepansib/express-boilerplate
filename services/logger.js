const Winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');
const {v4: uuidV4} = require("uuid");
const _ = require("lodash");
var httpContext = require('express-http-context');

const createDefaultLogFieldsMiddleware = (req, res, next) => {
    httpContext.set('defaultMeta', {
        requestUuid: uuidV4(),
        requestOriginalUrl: req.originalUrl,
        requestPath: req.path,
        requestMethod: req.method,
        requestBody: req.body,
        requestParams: req.params
    });
    next();
};

const logRequestResponseMiddleware = (req, res, next) => {

    // Log request
    logger.info('Request');

    // Get response body
    let oldWrite = res.write,
        oldEnd = res.end,
        chunks = [],
        responseBody;

    res.write = function (chunk) {
        chunks.push(chunk);
        return oldWrite.apply(res, arguments);
    };

    res.end = function (chunk) {
        if (chunk) chunks.push(chunk);
        responseBody = Buffer.concat(chunks).toString('utf8');
        oldEnd.apply(res, arguments);
    };

    // Log response
    const startHrTime = process.hrtime();
    res.on("finish", (chunk) => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        logger.info('Response: ' + res.statusCode, {
            responseDurationMs: Math.round(elapsedTimeInMs),
            responseLocals: res.locals,
            responseBody: responseBody,
            responseStatusCode: res.statusCode
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