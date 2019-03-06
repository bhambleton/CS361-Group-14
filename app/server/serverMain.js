/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/04
 * Description: Handles high-level routing logic.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

/*setup server*/
var express = require('express');
var mysql = require('./public/scripts/dbConnection.js');
var bodyParser = require('body-parser');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 8657);
app.set('mysql', mysql);

/* outside access stuff that I don't think we need
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
*/

/*homepage*/
app.get('/', function(req,res)
{
    var dum;
    res.render('home', dum);
});

/*server-test handlers*/
app.use('/server-test/db', require('./public/scripts/serverTest.js'));

/*client request handlers*/
app.use('/client-target', require('./public/scripts/clientTarget.js'));

/*error handlers*/
app.use(function(req,res)
{
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next)
{
    console.error(err.stack);
    res.type('plain/text');
    res.status(500);
    res.render('500');
});

/*log server start to console*/
app.listen(app.get('port'), function()
{
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});