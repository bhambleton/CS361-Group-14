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
    //set cur input
    var curIn = inputs[i];

    //check input properties to set correct event listener
    //resource type buttons
    if (curIn.getAttribute("name") === "resourceType")
    {
        //debug
        //console.log("adding event listener to button " + b + " which has id " + b.id);

        curIn.addEventListener('click', function (selection)
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
                    alert("Could not find that service locally, here is a social worker's contact information to assist you\n\nName: Jane McSocialWorker\nPhone Number: (123) 456-7890\nEmail: jmcsocial@localcompany.com\nCompany: mySocialWorkerEmployer");
                    console.log("Couldn't find any resources, here is a nearby social worker's contact information!");
                }
                else //submit
                {
                    console.log("submitting form!");

                    //ask user to wait (for scraper) if tempwork submitted
                    if (selection === "Temporary Work") {
                        document.getElementById("loadingMessage").textContent = "Searching local listings..."
                    }

                    document.getElementById("searchForm").submit();
                }
            };
        }(curIn.value));
    }
    else
    {
        //do nothing
    }
}

//row-by-row edit buttons: hide/display edit fields for row
var buttons = document.getElementsByTagName("button");

//loop through them and set event listener
for (var c = 0; c < buttons.length; c++)
{
    //debug
    //console.log(c);
    //console.log(buttons[c].getAttribute("id").substr(-10, 10));

    //handle row-by-row edit buttons; toggles edit/claim fields on/off
    if (buttons[c].getAttribute("id").substr(-10, 10) === "editToggle")
    {
        //get the id of the service in the cur row
        var curID = buttons[c].nextElementSibling.getAttribute("value");

        //debug
        //console.log(curID);

        //add the event listener
        buttons[c].addEventListener('click', function (id)
        {
            return function ()
            {
                //find fields - for now just bothering with phone and the submit button
                var curPhoneEditElem = document.getElementById(id + "_phoneEdit");
                var editSubmitElem = document.getElementById(id + "_edit_submit");

                //toggle their visibility with class info
                if (curPhoneEditElem.classList.contains("noDisplay"))
                {
                    curPhoneEditElem.classList.remove("noDisplay");
                    editSubmitElem.classList.remove("noDisplay");
                    editSubmitElem.setAttribute("type", "submit");
                }
                else
                {
                    curPhoneEditElem.classList.add("noDisplay");
                    editSubmitElem.classList.add("noDisplay");
                    editSubmitElem.setAttribute("type", "hidden");
                }
            }
        }(curID));
    }
}

//provider dash buttons
//find elems
var editMaster = document.getElementById("editMasterToggle");
var deleteMaster = document.getElementById("deleteMasterToggle");
var claimMaster = document.getElementById("claimMasterToggle");

//unveil all row-by-row edit buttons
if (editMaster && editMaster !== 'undefined')
{
    editMaster.addEventListener("click", function()
    {
        //debug
        //console.log("inputs is of length " + inputs.length);

        for (var i = 0; i < buttons.length; i++)
        {
            //set cur input
            var curEditButton = buttons[i];

            //debug
            //console.log("curIn has ID " + curEditButton.getAttribute("id") + ", and last 10 is" );

            //toggle
            if (curEditButton.getAttribute("id") && curEditButton.getAttribute("id") !== "undefined" && curEditButton.getAttribute("id").substr(-10, 10) === "editToggle")
            {
                //debug
                //console.log("toggling row-by-row edit button");

                if (curEditButton.classList.contains("noDisplay"))
                {
                    curEditButton.classList.remove("noDisplay");
                }
                else
                {
                    curEditButton.classList.add("noDisplay");
                }
            }
        }
    });
}

//unveil all row-by-row claim buttons
if (claimMaster && claimMaster !== 'undefined')
{
    claimMaster.addEventListener("click", function ()
    {
        //debug
        //console.log("inputs is of length " + inputs.length);

        for (var i = 0; i < buttons.length; i++)
        {
            //set cur input
            var curClaimButton = buttons[i];

            //debug
            //console.log("curIn has ID " + curClaimButton.getAttribute("id") + ", and last 6 is" + curClaimButton.getAttribute("id").substr(-6, 6));

            //toggle
            if (curClaimButton.getAttribute("id") && curClaimButton.getAttribute("id") !== "undefined" && curClaimButton.getAttribute("id").substr(-5, 5) === "claim")
            {
                //debug
                //console.log("toggling row-by-row claim button");

                if (curClaimButton.classList.contains("noDisplay"))
                {
                    curClaimButton.classList.remove("noDisplay");
                }
                else
                {
                    curClaimButton.classList.add("noDisplay");
                }
            }
        }
    });
}

//unveil all row-by-row delete buttons
if (deleteMaster && deleteMaster !== 'undefined')
{
    deleteMaster.addEventListener("click", function ()
    {
        //debug
        //console.log("inputs is of length " + inputs.length);

        for (var i = 0; i < buttons.length; i++)
        {
            //set cur input
            var curDeleteButton = buttons[i];

            //toggle
            if (curDeleteButton.getAttribute("id") && curDeleteButton.getAttribute("id") !== "undefined" && curDeleteButton.getAttribute("id").substr(-6, 6) === "delete")
            {
                //debug
                //console.log("toggling row-by-row delete button");

                if (curDeleteButton.classList.contains("noDisplay"))
                {
                    curDeleteButton.classList.remove("noDisplay");
                }
                else
                {
                    curDeleteButton.classList.add("noDisplay");
                }
            }
        }
    });
}