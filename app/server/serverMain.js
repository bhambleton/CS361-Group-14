/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/04
 * Description: Handles high-level routing logic.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *
 * Update Log:
 *          2019/03/05  JAK     - added entry to handle independent-client post requests at /client-target/
 *
 *          2019/03/06  JAK     - removed /client-target/ handler path, as we decided to not use entirely-separate client module
 *                              - refactored into two main paths:
 *                                  1) /client/, which is where we actually implement the app
 *                                  2) /dev/, which is where we do stuff like run raw DB queries or play around with
 *                                     the web scraper or whatever
 *********************************************************************************************************************/

//setup server
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

//access control stuff that I don't think we need
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//server root - simply choose client or dev environment
app.get('/', function(req,res)
{
    var dum;

    res.render('server_root', dum);
});

//client handlers - most of our "Persistent Layer" happens in here
app.use('/client', require('./public/scripts/clientHandle.js'));

//dev handlers (for testing or general tom-foolery
app.use('/dev', require('./public/scripts/devHandle.js'));

//error handlers
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

//log server start to console
app.listen(app.get('port'), function()
{
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});