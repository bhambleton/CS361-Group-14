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

            //render the page
            res.render('client_search_results', context);
        });

    });

    //show raw r/w user table
    router.get('/db/rw_user_raw', function(req,res,next)
    {
        var interfaceMysql = req.app.get('mysql');

        //declare response object
        var context = {};

        //send the query
        interfaceMysql.pool.query('SELECT * FROM RW_USER', function(err, rows, fields)
        {
            if(err)
            {
                next(err);
                return;
            }

            //define the fields in the template page to be rendered
            context.results = rows;
            context.fields = fields;

            //render the page
            res.render('dev_table_raw', context);
        });

    });

    //playround w/ scraper output
    router.get('/temp_work_scraper', function(req,res,next)
    {
        //report start
        console.log('Starting scraper process...');

        //debug - what the heck is the dang cwd
        //console.log(proc('dir',null,'pipe').toString('utf-8'));

        //run scraper and send stdio to server output
        console.log(proc('py',["public/scripts/JobScraper.py", null, 'pipe']).output.toString('utf-8'));

        //report done
        console.log('...scraper process complete!');

        //read file output by scraper proc and split by delimiter
        //source: https://stackoverflow.com/questions/34857458/reading-local-text-file-into-a-javascript-array
        var jobsRaw = fs.readFileSync("../jobList.csv", 'utf-8');   //read in all text raw
        var jobsByLine = jobsRaw.split("\r\r\n");                   //split it by the line delimiter

        //get rid of he first line that just has headers, and get rid of last line that is blank
        jobsByLine.shift();
        jobsByLine.pop();

        //debug
        console.log(jobsRaw);
        console.log(jobsByLine);

        //now for every line element in the newly created array, delimit further by the | delimiter
        for (var curLine in jobsByLine)
        {
            console.log("curLine is: " + jobsByLine[curLine]);
            jobsByLine[curLine] = jobsByLine[curLine].split("|");
        }

        //debug
        console.log(jobsByLine);

        res.send(jobsByLine);
    });

    //do it!
    return router;
}();