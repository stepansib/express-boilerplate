const Winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');

const logger = Winston.createLogger({
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
                node: 'http://elastic:changeme@localhost:9200',
                // log: 'debug',
                // maxRetries: 2,
                // requestTimeout: 10000,
                // sniffOnStart: false,
            }
        })
    ],
});

module.exports = logger;