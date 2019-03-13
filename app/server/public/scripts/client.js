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

    //ignore any non-button inputs AND ignore the login button
    if (b.getAttribute("type") !== "button" || b.getAttribute("name") === "Login")
    {
        //do nothing

        //debug
        //console.log("cur input is not a button, so do nothing");
    }
    else
    {
        //debug
        //console.log("adding event listener to button " + b + " which has id " + b.id);

        b.addEventListener('click', function ()
        {
            console.log("submitting form!");

            document.getElementById("searchForm").submit();
        });
    }
}