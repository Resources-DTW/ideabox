'use strict';
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = require('express').Router();
const config = require('./config');

/**
 * configure express application.
 * @param {Express} app 
 * @returns {Promise}
 */
var configureExpressApp = function(app) {
    return new Promise((resolve, reject) => {
        require('./routes/routes')(router);
        app.use(bodyParser.urlencoded({
            extended: true,
            limit: '500mb',
            parameterLimit: 50000
        }));
        app.use(bodyParser.json({ limit: '500mb' }));
        app.use(function(req, res, next) {
            res.setHeader('Access-Control-Allow-Origin', '*'); //Enable CORS
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Permissions');
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
            next();
        });
        useAdditionalMiddleware(app);
        resolve();
    });
};

function useAdditionalMiddleware(app) {
    app.use(morgan(config.LOG_TYPE));
    app.use(`/api/${config.API_VERSION}/`, router);
    app.use(errorHandler);
}

function errorHandler(err, req, res, next) {
    if (err.name === 'ValidationError') {
        console.log('Error', { 'Details': err.toString() });
        return res.status(400).send(err);
    }
    console.log('Unhandled Error', { 'Details': err, 'Stack': err.stack });
    return res.status(500).send(err);
}

module.exports = {
    configureExpressApp: configureExpressApp
};