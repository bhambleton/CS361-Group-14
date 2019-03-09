/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/06
 * Description: Runs the bulk of the "Persistent Layer" of the UML diagram. Handle client requests (as defined by Use Cases
 *              and User Stories), DB interaction, web scraper initiator/result parser, data packager/sender.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

module.exports = function()
{
    //define dependency
    var express = require('express');

    //define routing object
    var router = express.Router();

    /*ROUTES*/
    //generic GET hits to <server root>/client/ simply render home page
    router.get('/', function(req,res)
    {
        //report user access to console
        console.log('Somebody somewhere sent a GET to root/client/');

        var dum;

        //render the home page
        res.render('client_home', dum);
    });

    //if any POST hits <server root>/client/, the client is making some request for info
    router.post('/', function(req,res,next)
    {
        //report user access to console
        console.log('Somebody somewhere sent a POST to root/client/');

        //store the user parameters stored in the request body
        var userParams = req.body;

        //log to server console whatever the user requested
        console.log('POST request contained:');
        console.log(userParams);

        //define data package to return to user
        var context = {};

        //here, later, customize the query to send to the DB. for now, just grab everything from SERVICE

        //get stuff from the database
        var mysql = req.app.get('mysql');
        mysql.pool.query('SELECT * FROM SERVICE', function(err, rows, fields)
        {
            if(err)
            {
                next(err);
                return;
            }

            //define the fields in the template page to be rendered
            context.results = rows;
            context.fields = fields;
            context.type = req.body.id;
            context.zip = req.body.zip;

            //define the address to show
            context.route_to = '/';

            //render the results page and pass the info that handlebars will use to populate its {{}} brackets
            res.render('client_search_results', context);
        });
    });

    //do it!
    return router;
}();