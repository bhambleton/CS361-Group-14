/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/04
 * Description: Defines the database connection & pool.
 *
 * Attribution: Structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

var mysql = require('mysql');

var pool = mysql.createPool
({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs361_kirkhamj',
    password        : 'hhkrw14',
    database        : 'cs361_kirkhamj'
});

module.exports.pool = pool;