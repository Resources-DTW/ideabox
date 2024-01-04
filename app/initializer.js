'use strict';
const mysql = require('mysql2');
const config = require('./config');
require('colors');

/**
 * Check initial configurations like db connection, log folder existance, etc...
 * @returns {Promise}
 */
var initialize = function () {
    return connectInternalMysqlDB()
};

var connectInternalMysqlDB = function () {
    return new Promise((resolve, reject) => {
        var mysqlConnection = mysql.createPool({
            host: config.MYSQL_HOST,
            user: config.MYSQL_USERNAME,
            password: config.MYSQL_PASSWORD,
            database: config.MYSQL_DATABASE,
        });
        var InternalMysqlDB = mysql.connection;
        
        // InternalMysqlDB.once('connected', function connectionSuccess() {
        //     console.log('Mysql Internal Database Connection Establishement. '.bold.cyan + '[ ' + 'OK'.bold.green + ' ]');
        //     resolve();
        // });

        // InternalMysqlDB.once('reconnected', function connectionSuccess() {
        //     console.log('Mysql Internal Database Reconnection Establishement. '.bold.cyan + '[ ' + 'OK'.bold.green + ' ]');
        //     resolve();
        // });

        // InternalMysqlDB.on('disconnected', () => {
        //     console.log('Mysql Internal Database Disconnected'.bold.red);
        // });

        // InternalMysqlDB.on('error', function connectionError(err) {
        //     console.log('Mysql Internal Database Connection Establishement. '.bold.cyan + '[ ' + 'X'.bold.red + ' ]\n');
        //     console.log('Mysql Error connecting Internal Database.\nDetails: ' + err.toString().bold.red);
        //     process.exit(0);
        // });
    });
};

process.on('SIGINT', () => {
    // mongoose.connection.close()
    //     .then(() => {
    //         process.exit(0);
    //     });

    mysql.connection.close()
        .then(() => {
            process.exit(0);
        });
});

module.exports.initialize = initialize;
