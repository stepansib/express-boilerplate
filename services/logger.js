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
                node: 'http://elastic:changeme@localhost:9200'
            }
        })
    ],
});

module.exports = logger;