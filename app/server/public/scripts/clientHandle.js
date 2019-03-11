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

        //store the user parameters stored in the request body into a GLOBAL variable
        /*have to do this stupid Object.keys thing because for some reason
        the parameters are getting passed to the server in a long string, as the name of the first key*/
        userParams = JSON.parse(Object.keys(req.body)[0]);

        //log to server console whatever the user requested
        console.log('POST request contained:');
        console.log(userParams);

        //define GLOBGAL data object to be filled by scraper/DB query
        results = [];
        fields = [];

        //if user chose temp work, then activate scraper. else, query DB
        if (userParams.id === 'tempWork')
        {
            //debug
            console.log("Activating web scraper");

            //temp dum data
            //results = [{name: 'Groundskeeper at Fake Business', address_street: '15 Tea Party Way', address_city: 'Boston', address_state: 'MA', notes: 'no redcoats allowed'}];

            //activate scraper
            //report proc start
            console.log('Starting scraper process...');

            //debug - what the heck is the dang cwd
            //console.log(proc('dir',null,'pipe').toString('utf-8'));

            //run scraper and send stdio to server output
            console.log(proc('py',["public/scripts/JobScraper.py", null, 'pipe']).output.toString('utf-8'));

            //report proc done
            console.log('...scraper process complete!');

            //read file output by scraper proc and split by delimiter
            //source: https://stackoverflow.com/questions/34857458/reading-local-text-file-into-a-javascript-array
            var jobsRaw = fs.readFileSync("../jobList.csv", 'utf-8');   //read in all text raw
            var jobsByLine = jobsRaw.split("\r\r\n");                   //split it by the line delimiter

            //get rid of the first line that just has headers, and get rid of last line that is blank
            jobsByLine.shift();
            jobsByLine.pop();

            //debug
            //console.log(jobsRaw);
            //console.log(jobsByLine);

            //now for every line element in the newly created array, delimit further by the | delimiter
            for (var curLine in jobsByLine)
            {
                console.log("curLine is: " + jobsByLine[curLine]);
                jobsByLine[curLine] = jobsByLine[curLine].split("|");
            }

            //debug
            //console.log(jobsByLine);

            //render the results page and pass the info that handlebars will use to populate its {{}} brackets
            var context =
                {
                    "jobVomit": jobsByLine,
                    "type": userParams.id,
                    "zip": userParams.zip
                };

            console.log(context);

            //render the results page and pass the info that handlebars will use to populate its {{}} brackets
            res.render('client_search_results', context);
        }
        else
        {
            //debug
            console.log("Sending query to DB");

            //here, later, customize the query to send to the DB. for now, just grab everything from SERVICE

            //get stuff from the database
            var mysql = req.app.get('mysql');

            mysql.pool.query('SELECT * FROM SERVICE', function (err, sqlRows, sqlFields)
            {
                if (err)
                {
                    next(err);
                    return;
                }

                //store the returned DB fields in the template page to be rendered
                results = sqlRows;
                fields = sqlFields;

                //build the context object to render the results to user
                var context =
                    {
                        "results": results,
                        "fields": fields,
                        "type": userParams.id,
                        "zip": userParams.zip
                    };

                console.log(context);

                //render the results page and pass the info that handlebars will use to populate its {{}} brackets
                res.render('client_search_results', context);
            });
        }
    });

    //do it!
    return router;
}();