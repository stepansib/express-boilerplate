const Winston = require('winston');
const ElasticsearchTransport = require('winston-elasticsearch');

module.exports = Winston.createLogger({
    transports: [
        new Winston.transports.Console(),
        new ElasticsearchTransport.ElasticsearchTransport({
            index: 'express',
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
