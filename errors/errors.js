var HttpStatus = require('http-status-codes');

class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    code = HttpStatus.INTERNAL_SERVER_ERROR;

    getCode() {
        return this.code;
    }
}

class BadRequest extends GeneralError {
    code = HttpStatus.BAD_REQUEST;
}

class NotFound extends GeneralError {
    code = HttpStatus.NOT_FOUND;
}

module.exports = {
    GeneralError,
    BadRequest,
    NotFound
};