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
        swid = userParams.swid;
        success = false;
        actionType = userParams.loginNewOrExisting;

        //compare against DB
        var interfaceMysql = req.app.get('mysql');

        //check if logging in/registering.
        if (userParams.loginNewOrExisting && userParams.loginNewOrExisting !== 'undefined')
        {
            //report
            console.log("Detecting " + userParams.loginNewOrExisting + " " + userParams.username + " logging in with password REDACTED");

            //check if new or existing and handle accordingly
            if (userParams.loginNewOrExisting === "Existing User") {
                //report
                console.log("Checking DB for existing user");

                //send the query
                interfaceMysql.pool.query('SELECT username, password, sw_id FROM RW_USER WHERE username = \'' + username + '\'', function (err, rows, fields)
                {
                    if (err)
                    {
                        next(err);
                        return;
                    }

                    console.log('returned rows: ');
                    console.log(rows);

                    //check returned credentials
                    //no rows? no username
                    if (rows.length !== 1)
                    {
                        //no matching username. you lose, good day sir.
                        var context = {};
                            context.whoDis = "Couldn't find that username/password combo! Try again";

                        console.log("Failure. Message to user: " + context.whoDis);
			            res.render('no_user', context);
                    }
                    //check password
                    else if (password === rows[0].password)
                    {
                        //success, render login
                        //define the fields in the template page to be rendered
                        var context = {};
                        context.username = rows[0].username;
                        context.swid = rows[0].swid;
                        context.success = true;
                        context.newUser = false;

                        //render the page
                        res.render('client_logged_in_home', context);
                    }
                    else //wrong password
                    {
                        //no matching pass. same msg as when no username found at all
                        context = {};
                        context.whoDis = "Couldn't find that username/password combo! Try again";

                        console.log("Failure. Message to user: " + context.whoDis);
                        res.render('no_user', context);
                    }
                })
            }
            else //add user to DB. R/W user registrant contained here
            {
                //report
                console.log("Adding user to DB");

                //if user provided a SWID, then validate creds
                if (swid && swid !== 'undefined') {
                    //report
                    console.log("Checking 3rd-party SWID data to validate SWID #" + swid);

                    //send query
                    interfaceMysql.pool.query('SELECT sw_3rd_party_id FROM SW_THIRD_PARTY_STORE_SIM WHERE sw_3rd_party_id = \'' + swid + '\'', function (err, rows, fields)
                    {
                        if (err)
                        {
                            next(err);
                            return;
                        }

                        console.log('returned rows: ');
                        console.log(rows);

                        //check returned credentials
                        //no rows? no SWID
                        if (rows.length !== 1)
                        {
                            var context = {};
                            context.whoDis = "Could not authenticate SW ID #" + swid;

                            console.log("Failure. Message to user: " + context.whoDis);
                            
                            res.render('no_user', context);
                        }
                    });
                }

                //if here, then either user did not provide a SWID or the SWID was validated. proceed with registration.
                //need to check if username OR SWID already taken

                //report
                console.log('Checking RW_USER to verify that the username and SWID are available');

                //modularize where clause for readability
                var whereClause = '((username = \'' + username + '\') OR (sw_id = \'' + swid + '\'))';

                //send query
                interfaceMysql.pool.query('SELECT username, sw_id FROM RW_USER WHERE ' + whereClause, function (err, rows, fields)
                {
                    if (err)
                    {
                        next(err);
                        return;
                    }

                    console.log('returned rows: ');
                    console.log(rows);

                    //check if any username/swid already in use.
                    //no rows? good to register!
                    if (rows.length !== 0)
                    {
                        //what was taken - username, swid, or both? append to var inUse
                        var context = {};
                            context.whoDis = '';

                        /* this kinda works but assumes only one row returned. For now, just a simple error message
                        //username?
                        if (rows[0].username && rows[0].username !== 'undefined' && rows[0].username === username)
                        {
                            context.whoDis = context.whoDis.concat('Username \'' + username + '\' already in use.\n');
                        }

                        if (rows[0].sw_id && rows[0].sw_id !== 'undefined' && rows[0].sw_id !== '')
                        {
                            context.whoDis = context.whoDis.concat('SW ID \'' + swid + '\' already in use.');
                        }
                        */
                        context.whoDis = 'Username or SW ID already in use.';

                        console.log("Failure. Message to user: " + context.whoDis);
                        res.render('no_user', context);
                    }
                    else //if here, good to register
                    {
                        //report
                        console.log('username and SWID not in use, proceeding with registration');

                        //format sw_id insert text. if provided, then keep it. else set it to 'NULL'
                        if (!swid || swid === 'undefined' || swid <= 0)
                        {
                            swid = 'NULL';
                        }

                        //send insert
                        interfaceMysql.pool.query('INSERT INTO RW_USER (username, password, sw_id) VALUES (\'' + username + '\', \'' + password + '\', ' + swid + ')', function (err, data)
                        {
                            if (err)
                            {
                                next(err);
                                return;
                            }

                            console.log('returned rows: ');
                            console.log(data);

                            //verify registration success and redirect user
                            if (data.serverStatus === 2)
                            {
                                //success, render login
                                //define the fields in the template page to be rendered
                                var context = {};
                                context.username = username;
                                context.swid = swid;
                                context.success = true;
                                context.newUser = true;

                                //render the page
                                res.render('client_logged_in_home', context);
                            }
                        });
                    }
                });


            }
        }
    });

    //for editing or deleting entries in the service DB
    router.post('/update_or_delete', function(req, res, next)
    {
        //report user access to console
        console.log('Somebody somewhere sent a POST to root/client/');

        //store the user parameters stored in the request body into a GLOBAL variable
        userParams = req.body;

        //log to server console whatever the user requested
        console.log('POST request contained:');
        console.log(userParams);

        //process update
        //define strings

        /*
        //send query
        var interfaceMysql = req.app.get('mysql');
        interfaceMysql.pool.query('', function (err, rows)
        {
            if (err)
            {
                next(err);
                return;
            }

            console.log('returned rows: ');
            console.log(rows);
        */
        res.send("actual update/edit capability coming soon...");
        //})
    });

    //do it!
    return router;
}();
