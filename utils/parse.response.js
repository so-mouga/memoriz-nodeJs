var express = require('express');

module.exports.success = (data) => {
    return {
        success  : true,
        response : data
    };
}

module.exports.error = (res, message, statusCode = '404') => {
    res.status(statusCode);
    return {
        success : false,
        error   : message
    };
}
