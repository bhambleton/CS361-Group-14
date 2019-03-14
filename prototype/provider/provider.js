
function register() {
  document.getElementById('providerHeader3').innerHTML = "Provider Registration";
  document.getElementById("registrationStuff").style.visibility="visible";  
}

function regSubmit() {
  document.getElementById('providerHeader3').innerHTML = "Thank you for registering.";
  document.getElementById("registrationStuff").style.visibility="hidden";
  }


var registerButton = document.getElementById('registerButton');
registerButton.addEventListener('click', register);

var regSubmitButton = document.getElementById('regSubmitButton');
regSubmitButton.addEventListener('click', regSubmit);


document.getElementById("registrationStuff").style.visibility="hidden";

