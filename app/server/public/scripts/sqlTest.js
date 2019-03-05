/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/04
 * Description: Test query logic for the database.
 *              The entirety of the table is displayed.
 *
 * Attribution: Some structure and syntax inspired by J. Wolford's BSG sample web app available on GitHub here:
 *              https://github.com/wolfordj/CS340-Sample-Web-App/
 *********************************************************************************************************************/

module.exports = function()
{
    var express = require('express');
    var router = express.Router();

    /*gatherFieldsAndValues() pulls in SQL result information to figure out which values occur in which columns.
    * It will return a 2D-array that contains all of the possible values for any given field, in order of the
    * fields as they were called in the original SELECT statement.*/
    function gatherFieldsAndValues(inRows, inFields)
    {
        var numFields = inFields.length;
        var numRows = inRows.length;

        var vals = [numRows];

        //get all vals in selection for each column and place into an array
        for (var i = 0; i < numFields; i++)
        {
            vals[i] = [];
            var tempField = inFields[i].name;

            if (tempField)
            {
                for (var j = 0; j < numRows; j++)
                {
                    vals[i].push(inRows[j][tempField]);
                }
            }
            else
            {
                vals[i].push(NULL);
            }
        }

        //make a master object that contains name: [val,val,val] pairs
        fv = {};

        for (var k = 0; k < numFields; k++)
        {
            var fvTempField = inFields[k].name;

            fv[fvTempField] = vals[k];
        }

        //remove any keys that are just IDs. For the rest, sort vals and remove dupes
        for (var key in fv)
        {
            var tempNumRows = numRows;

            if (key.includes("ID"))
            {
                delete fv[key];
            }
            else
            {
                //sort vals -- idea from https://www.w3schools.com/js/js_array_sort.asp
                if (typeof(fv[key][1]) == "string")
                {
                    fv[key].sort();
                }
                else
                {
                    fv[key].sort(function(a, b){return a - b});
                }

                //delete dupes
                for (var v = 0; v < (tempNumRows - 1); v++)
                {
                    if((fv[key][v] === fv[key][v+1]) || (typeof(fv[key][v]) == "undefined"))
                    {
                        fv[key].splice(v+1, 1);

                        v--;

                        tempNumRows--;
                    }
                }
            }
        }

        return fv;
    }

    router.get('/service_test', function(req,res,next)
    {
        var context = {};
        var interfaceMysql = req.app.get('mysql');

        interfaceMysql.pool.query('SELECT * FROM SERVICE', function(err, rows, fields)
        {
            if(err)
            {
                next(err);
                return;
            }

            context.results = rows;
            context.fields = fields;
            context.route_to = "/db/service_test";

            res.render('table_raw', context);
        });

    });

    return router;
}();