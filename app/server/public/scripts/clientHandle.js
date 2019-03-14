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
    router.post('/results', function(req,res,next)
    {
        //report user access to console
        console.log('Somebody somewhere sent a POST to root/client/results/');

        //store the user parameters stored in the request body into a GLOBAL variable
        userParams = req.body;

        //log to server console whatever the user requested
        console.log('POST request contained:');
        console.log(userParams);

        //define GLOBAL data object to be filled by scraper/DB query (if needed)
        results = [];
        fields = [];

        //begin handling user's request
        //if user chose temp work, then activate scraper. else, query DB
        if (userParams.resourceType === 'Temporary Work')
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

            //remove the first header element from the job list and store it
            var headers = jobsByLine.shift().split("|");

            //get rid of last line that is blank
            jobsByLine.pop();

            //debug
            //console.log(jobsRaw);
            //console.log(jobsByLine);

            //now for every line element in the newly created array, delimit further by the | delimiter and assign to a key/value pair
            var results = [];
            for (var curLine in jobsByLine)
            {
                //debug
                //console.log("curLine is: " + jobsByLine[curLine]);

                //delimit
                jobsByLine[curLine] = jobsByLine[curLine].split("|");

                //assign to key/val pair based on cur val relative to headers
                results[curLine] = {};

                //set key "id" = value (curLine) (+1 for 1-indexing)
                results[curLine].id = (curLine+1);

                //debug
                //console.log("headers.length is " + headers.length);

                //create key/value pairs for each key defined in the jobList.csv header
                for (var i=0; i < headers.length; i++)
                {
                    //debug
                    //console.log("setting header " + headers[i] + " to value " + jobsByLine[curLine][i]);

                    //set key = value
                    results[curLine][headers[i]] = jobsByLine[curLine][i];
                }
            }

            //debug
            //console.log(jobsByLine);
            console.log(headers);
            console.log(results);

            //render the results page and pass the info that handlebars will use to populate its {{}} brackets
            var context =
                {
                    results: results,
                    "type": userParams.resourceType,
                    "zip": userParams.zipcodeInput
                };

            //console.log(context);

            //render the results page and pass the info that handlebars will use to populate its {{}} brackets
            res.render('client_search_results', context);
        }
        else ///must be a DB query
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

                //console.log(context);

                //render the results page and pass the info that handlebars will use to populate its {{}} brackets
                res.render('client_search_results', context);
            });
        }
    });

    //registrant and login handler
    router.post('/', function(req, res, next)
    {
        //report user access to console
        console.log('Somebody somewhere sent a POST to root/client/');

        //store the user parameters stored in the request body into a GLOBAL variable
        userParams = req.body;

        //log to server console whatever the user requested
        console.log('POST request contained:');
        console.log(userParams);

        //define GLOBAL data object to be filled by registrant results
        username = userParams.username;
        password = userParams.password;
        success = false;
        actionType = userParams.loginNewOrExisting;

        //check if logging in/registering. R/W user registrant contained here
        if (userParams.loginNewOrExisting && userParams.loginNewOrExisting !== 'undefined')
        {
            //report
            console.log("Detecting " + userParams.loginNewOrExisting + " " + userParams.username + " logging in with password REDACTED");

            //check if new or existing and handle accordingly
            if (userParams.loginNewOrExisting === "Existing User") {
                //report
                console.log("Checking DB for existing user");

                //compare against DB
                var interfaceMysql = req.app.get('mysql');

                //send the query
                interfaceMysql.pool.query('SELECT username, password FROM RW_USER WHERE username = \'' + username + '\'', function (err, rows, fields) {
                    if (err) {
                        next(err);
                        return;
                    }

                    console.log('returned rows: ');
                    console.log(rows);

                    //check returned credentials
                    //no rows? no username
                    if (rows.length !== 1) {
                        //no matching username. you lose, good day sir.
                        var whoDis;
                        console.log("Huh? I don't know who this is. Try again");
			res.render('no_user', whoDis);
                    }
                    //check password
                    else if (password === rows[0].password) {
                        //success, render login
                        //define the fields in the template page to be rendered
                        var context = {};
                        context.username = rows[0].username;
                        context.success = true;

                        //render the page
                        res.render('client_logged_in_home', context);
                    }
                    else //wrong password
                    {
                        var whoDis;
			alert("Huh? I don't know who this is. Try again");
			res.render('no_user', whoDis);
                    }
                })
            }
                else //add user to DB
                {
                    //report
                    console.log("Adding user to DB");
                }
        }
    });

    //do it!
    return router;
}();
