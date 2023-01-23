'use strict';

// Network Error class
export const NetworkError = class extends Error{
    constructor(status, msg, emptyFields){
        // Error Object constructor
        super(msg);

        this.name = 'NetworkError';
        this.message = msg;
        this.status = status;
        this.emptyFields = emptyFields || [];
    }
}