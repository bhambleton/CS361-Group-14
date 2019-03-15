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

//find inputs
var inputs = document.getElementsByTagName('input');

//debug
//console.log('client.js is adding event listeners to buttons, of which there are ' + buttons.length);

//loop through inputs and put event listeners on as appropriate
for (var i = 0; i < inputs.length; i++)
{
    //set cur button
    var b = inputs[i];

    //check input properties to set correct event listener
    //resource type buttons
    if (b.getAttribute("name") === "resourceType")
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
    else
    {
        //do nothing
    }
}

//edit/delete buttons - hide/display fields for row
var buttons = document.getElementsByTagName("button");

//loop through them and set event listener
for (var c = 0; c < buttons.length; c++)
{
    console.log(c);
    console.log(buttons[c].getAttribute("id").substr(-10,10));

    //if it's an edit toggle button, add the event listener that sets it to toggle the edit fields for the row
    if (buttons[c].getAttribute("id").substr(-10,10) === "editToggle")
    {
        //get the id of the service in the cur row
        var curID = buttons[c].nextElementSibling.getAttribute("value");

        //debug
        //console.log(curID);

        //add the event listener
        buttons[c].addEventListener('click', function (id)
        {
            return function()
            {
                //find fields
                var curPhoneEditElem = document.getElementById(id + "_phoneEdit");
                var submitElem = document.getElementById(id + "_submit");

                //toggle their visibility with class info
                if (curPhoneEditElem.classList.contains("noDisplay"))
                {
                    curPhoneEditElem.classList.remove("noDisplay");
                    submitElem.classList.remove("noDisplay");
                    submitElem.setAttribute("type","submit");
                }
                else
                {
                    curPhoneEditElem.classList.add("noDisplay");
                    submitElem.classList.add("noDisplay");
                    submitElem.setAttribute("type","hidden");
                }
            }
        }(curID));
    }
}