/**********************************************************************************************************************
 * Author: CS361 Group 14
 * Date Created: 2019/03/06
 * Description: Client-side scripts.
 *
 *********************************************************************************************************************/

//function to validate a zip code using regex. Source: https://www.w3resource.com/javascript-exercises/javascript-regexp-exercise-12.php 
function validateZipCode(inputZip) {
    var regex = /^\d{5}$/;

    return regex.test(inputZip);
}


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
            if (!validateZipCode(zip))
            //if (!zip) //leaving this here in case we don't want to use the method Casey provided
            {
                alert("Please enter a zipcode and then select a service!");
            }
	    else if (zip === "12345")
	    {
		alert("Could not find that service locally, here is a social worker's contact information to assist you\n\nName: Jane McSocialWorker\nPhone Number: (123) 456-7890\nEmail: jmcsocial@localcompany.com\nCompany: mySocialWorkerEmployer")
		console.log("Couldn't find any resources, here is a nearby social worker's contact information!");
	    }

            else //continue w/ sending request to server
            {
                //report to browser console
                console.log('Client about to send request for resource ' + id + ' in zip ' + zip);

                //create and open AJAX get request
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
                    //if the server response is ready, do stuff with it
                    if(req.status >= 200 && req.status < 400)
                    {
                        //log ready state to browser
                        console.log("Request successfully sent and returned with the response:\n" + req.response);

                        //since I can't figure out how to render the page by itself, store the results in the div
                        document.getElementById("resultsContainer").innerHTML = req.response;

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
                //event.preventDefault();
            }
        }
    }(b.id));
}
