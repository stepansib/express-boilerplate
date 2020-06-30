class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    code = 500;

    getCode() {
        return this.code;
    }
}

class BadRequest extends GeneralError {
    code = 400;
}

class NotFound extends GeneralError {
    code = 404;
}

module.exports = {
    GeneralError,
    BadRequest,
    NotFound
};