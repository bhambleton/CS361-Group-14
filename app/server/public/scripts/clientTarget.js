/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/05
 * Description: Target for clients accessing server. Clients access by POSTing to ~/client-target/.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

module.exports = function()
{
    var express = require('express');
    var router = express.Router();

    /*when a POST hits here, do things*/
    router.post('/', function(req,res)
    {
        //log incoming request
        console.log("Post request received!");
        console.log(req.body);

        //create a return object, and populate it with a message + whatever they sent
        var returnStuff = {};
        returnStuff.serverMsg = "Here's a message back from me, the server! Nice! What you sent me is shown in serverReceived.";
        returnStuff.serverReceived = req.body;

        //send back the object
        res.send(returnStuff);
    });

    //do it!
    return router;
}();