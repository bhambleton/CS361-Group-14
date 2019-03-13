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
var buttons = document.getElementsByTagName('input');

//debug
//console.log('client.js is adding event listeners to buttons, of which there are ' + buttons.length);

//loop through event listener and set on all buttons, passing thxe button's id so the server knows which button was clicked
for (var i = 0; i < buttons.length; i++)
{
    //set cur button
    var b = buttons[i];

    //ignore any non-button inputs
    if (b.getAttribute("type") !== "radio")
    {
        //do nothing

        //debug
        //console.log("cur input is not a button, so do nothing");
    }
    else
    {
        //debug
        //console.log("adding event listener to button " + b + " which has id " + b.id);

        b.addEventListener('click', function (selection)
        {
            return function()
            {
                var zip = document.getElementById("zipcodeInput").value;

                //if zip hasn't been entered then yell at them to enter one
                if (!validateZipCode(zip))
                //if (!zip) //leaving this here in case we don't want to use the method Casey provided
                {
                    alert("Please enter a five-digit zipcode, and then select a service!");
                }
                else if (zip === "12345") {
                    alert("Could not find that service locally, here is a social worker's contact information to assist you\n\nName: Jane McSocialWorker\nPhone Number: (123) 456-7890\nEmail: jmcsocial@localcompany.com\nCompany: mySocialWorkerEmployer")
                    console.log("Couldn't find any resources, here is a nearby social worker's contact information!");
                }
                else //submit
                {
                    console.log("submitting form!");

                    //ask user to wait (for scraper) if tempwork submitted
                    if (selection === "Temporary Work") {
                        document.getElementById("message").textContent = "Searching local listings..."
                    }

                    document.getElementById("searchForm").submit();
                }
            };
        }(b.value));
    }
}