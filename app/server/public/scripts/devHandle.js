/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/04
 * Description: Server testing within the /dev/ path. Includes test query logic for the database.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

module.exports = function()
{
    var express = require('express');
    var router = express.Router();

    //dev main level
    router.get('/', function(req,res)
    {
        var dum;

        //render the page
        res.render('dev_home', dum);
    });

    //show what's in the service table
    router.get('/db/service_raw', function(req,res,next)
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
            context.route_to = '/db/service_raw';

            //render the page
            res.render('dev_table_raw', context);
        });

    });

    //playround for rendering the result screen for a service search
    router.get('/db/service_result', function(req,res,next)
    {
        //type a string literal for whatever cols you want to pull, comma-separated.
        var colsToSelect = 'type, name, address_street, address_city, address_state, address_zip, email, phone, notes';

        //type your where clause here. be sure to escape in-string apostrophes. leave blank if you don't want to filter by anything.
        var whereClause = 'WHERE address_zip = \'12345\'';

        var interfaceMysql = req.app.get('mysql');

        //declare response object
        var context = {};

        //send the query
        interfaceMysql.pool.query('SELECT ' + colsToSelect + ' FROM SERVICE ' + whereClause, function(err, rows, fields)
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
            context.route_to = '/db/service_result';

            //render the page
            res.render('client_search_results', context);
        });

    });

    //do it!
    return router;
}();