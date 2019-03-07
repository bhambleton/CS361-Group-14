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
    var express = require('express');
    var router = express.Router();

    //render client home screen
    router.get('/', function(req,res,next)
    {
        var context = {};

        //render the page
        res.render('client_home', context);
    });

    //do it!
    return router;
}();