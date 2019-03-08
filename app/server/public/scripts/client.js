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
            else //continue w/ request
            {
                //report to browser console
                console.log('Client about to send request for resource ' + id + ' in zip ' + zip);

                //send info to server
                var req = new XMLHttpRequest();
                //yadayada
            }
        }
    }(b.id));
}