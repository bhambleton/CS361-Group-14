/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/06
 * Description: Client-side scripts.
 *
 *********************************************************************************************************************/

//find buttons
var buttons = document.getElementsByTagName('button');

//debug
//console.log('client.js is adding event listeners to buttons, of which there are ' + buttons.length);

//loop through event listener and set on all buttons, passing the button's id so the server knows which button was clicked
for (var i = 0; i < buttons.length; i++)
{
    //set cur button
    var b = buttons[i];

    //debug
    //console.log("adding event listener to button " + b + " which has id " + b.id);

    b.addEventListener('click', function(id)
    {
        //can i get a little closure
        return function()
        {
            //get zip
            var zip = document.getElementsByName('zipcodeInput')[0].value;

            //if zip hasn't been entered then yell at them to enter one
            if (!zip)
            {
                alert("Please enter a zipcode and then select a service!");
            }
            else //continue w/ sending request to server
            {
                //report to browser console
                console.log('Client about to send request for resource ' + id + ' in zip ' + zip);

                //create and open AJAX post request
                var req = new XMLHttpRequest();
                req.open("POST", "http://localhost:8657/client/", true);

                //put HTML headers on the POST request so the server knows to parse it as a POST
                req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

                //package the data object to send to the server
                var context = {};
                context.id = id;
                context.zip = zip;

                //before sending, configure the request object to report on its status.
                req.addEventListener('load',function()
                {
                    if(req.status >= 200 && req.status < 400)
                    {
                        console.log("Request sent and loaded\n");

                        //report server's response object
                        console.log(req.response);



                        //parse the response
                        //var parsedResponse = JSON.parse(req.response);
                        //console.log(parsedResponse);
                    }
                    else
                    {
                        console.log("Error! Request not successfully sent/loaded.");
                    }
                });

                //debug
                console.log('Sending a POST to server with contents:');
                console.log(context);

                //stringify the contents so they make sense to the server
                context = JSON.stringify(context);

                //now send the request, along with whatever info the server needs to know
                req.send(context);

                //stop the client from doing whatever it would normally do; server is handling page renders
                event.preventDefault();
            }
        }
    }(b.id));
}
