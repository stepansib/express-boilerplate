const Winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');

const logger = Winston.createLogger({
    defaultMeta: {
        env: process.env.NODE_ENV
    },
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

const logRequestResponse = (req, res, next) => {

    // Log request
    logger.info('Request', {
        method: req.method,
        originalUrl: req.originalUrl,
        path: req.path,
        requestBody: req.body,
    });

    // Log response
    const startHrTime = process.hrtime();
    res.on("finish", () => {
        const elapsedHrTime = process.hrtime(startHrTime);
        const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;
        logger.info('Response', {
            durationMs: Math.round(elapsedTimeInMs)
        });
    });

    next();
}

module.exports = {
    logger: logger,
    logRequestResponse: logRequestResponse
};