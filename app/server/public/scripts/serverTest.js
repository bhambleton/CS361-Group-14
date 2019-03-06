/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/04
 * Description: Server testing within the /server-test/ path. Includes test query logic for the database.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

module.exports = function()
{
    var express = require('express');
    var router = express.Router();

    //show what's in the service table
    router.get('/service-test', function(req,res,next)
    {
        var interfaceMysql = req.app.get('mysql');

        //declare response object
        var context = {};

        //send the query
        interfaceMysql.pool.query('SELECT * FROM SERVICE', function(err, rows, fields)
        {
            if(err)
            {
                next(err);
                return;
            }

            //define the fields in the template page to be rendered
            context.results = rows;
            context.fields = fields;

            //define the address to show
            context.route_to = "/server-test/db/service-test";

            //render the page
            res.render('table_raw', context);
        });

    });

    //do it!
    return router;
}();