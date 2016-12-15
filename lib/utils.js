"use strict";
const _ = require("lodash");
function createError(code, message) {
    this.code = code;
    this.message = message || '';
}
exports.createError = createError;
createError.prototype = Object.create(Error.prototype);
createError.prototype.constructor = createError;
function gatewayResponse(statusCode, body, headers = {}) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };
    return {
        statusCode,
        body,
        headers: _.assign(defaultHeaders, headers),
    };
}
exports.gatewayResponse = gatewayResponse;
function without(dict, ...without) {
    const narrow = _.assign({}, dict);
    without.map((i) => delete narrow[i]);
    return narrow;
}
exports.without = without;
function padLeft(width, value, padding = ' ') {
    const str = String(value);
    return (width <= str.length) ? str : padLeft(width, padding + str, padding);
}
exports.padLeft = padLeft;
