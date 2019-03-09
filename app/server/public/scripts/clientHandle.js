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

    //generic GET hits to <server root>/client/ simply render home page
    router.get('/', function(req,res)
    {
        //report user access to console
        console.log('Somebody somewhere sent a GET to root/client/');

        var dum;

        //render the home page
        res.render('client_home', dum);
    });

    //if any POST hits <server root>/client/, the client is making some request
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

        //if no info is passed, then just show the overall client home
        if (userParams.length === 0)
        {
            //debug
            console.log('Server detected !req.body so just rendering home client home');

            var dum;

            //render the page
            res.render('client_home', dum);
        }
        else //parse the client's request
        {
            //do stuff
            context.zip = '99999';
            context.name =  'test name';
            context.address_street = '123 fun lane';
        }

        //define the address to show
        context.route_to = '/';

        //render the results page and pass the info that handlebars will use to populate its {{}} brackets
        res.render('client_search_results', context)
    });

    //do it!
    return router;
}();