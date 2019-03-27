/*    


 *    Filename: script.js
 */
 

"use strict"; // interpret document contents in JavaScript strict mode

/* global variable */
var formValidity = true;

var delivInfo = {};
var foodInfo = {};
var delivSummary = document.getElementById("deliverTo");
var foodSummary = document.getElementById("order");


function previewOrder() {
   processDeliveryInfo();
   processFood();
   document.getElementsByTagName("section")[0].style.display = "block";
}

function processDeliveryInfo() {
   var prop;
   delivInfo.name = document.getElementById("nameinput").value;
   delivInfo.addr = document.getElementById("addrinput").value;
   delivInfo.city = document.getElementById("cityinput").value;
   delivInfo.email = document.getElementById("emailinput").value;
   delivInfo.phone = document.getElementById("phoneinput").value;
   for (prop in delivInfo) {
      delivSummary.innerHTML += "<p>" + delivInfo[prop] + "</p>";
   }
   document.getElementById("deliverTo").style.display = "block";
}



function processFood() {
   var prop;
   var crustOpt = document.getElementsByName("crust");
   var toppings = 0;
   var toppingBoxes = document.getElementsByName("toppings");
   var instr = document.getElementById("instructions");
   if (crustOpt[0].checked) {
      foodInfo.crust = crustOpt[0].value;
   } else {
      foodInfo.crust = crustOpt[1].value;
   }
   
   foodInfo.size = document.getElementById("size").value;
   
   for (var i = 0; i < toppingBoxes.length; i++) {
      if (toppingBoxes[i].checked) {
         toppings++;
         foodInfo["topping" + toppings] = toppingBoxes[i].value;
      }
   }
   
   if (instr.value !== "") {
      foodInfo.instructions = instr.value;
   }

   foodSummary.innerHTML += "<p><span>Crust</span>: " + foodInfo.crust + "</p>";
   foodSummary.innerHTML += "<p><span>Size</span>: " + foodInfo.size + "</p>";
   foodSummary.innerHTML += "<p><span>Topping(s)</span>: " + "</p>";
   foodSummary.innerHTML += "<ul>";
   for (var i = 1; i < 6; i++) {
      if (foodInfo["topping" + i]) {
         foodSummary.innerHTML += "<li>" + foodInfo["topping" + i] + "</li>";
      }
   }
   foodSummary.innerHTML += "</ul>";
   foodSummary.innerHTML += "<p><span>Instructions</span>: " + foodInfo.instructions;
   document.getElementById("order").style.display = "block";
}


/* create event listener  */
function createEventListener() {
   var previewBtn = document.getElementById("previewBtn");
   if (previewBtn.addEventListener) {
      previewBtn.addEventListener("click", previewOrder, false);
   } else if (previewBtn.attachEvent) {
      previewBtn.attachEvent("onclick", previewOrder);
   }
}

/* create event listener when page finishes loading */
if (window.addEventListener) {
   window.addEventListener("load", createEventListener, false);
} else if (window.attachEvent) {
   window.attachEvent("onload", createEventListener);
}



/* remove default value and formatting from selection list */
function removeSelectDefault() {
   var selectBox = document.getElementById("size");
   selectBox.selectedIndex = -1;
   selectBox.style.boxShadow = "none";
}

/* remove fallback placeholder text */
function zeroPlaceholder() {
   var instrBox = document.getElementById("instructions");
   instrBox.style.color = "black";
   if (instrBox.value === instrBox.placeholder) {
      instrBox.value = "";
   }
}

/* restore placeholder text if box contains no user entry */
function checkPlaceholder() {
   var instrBox = document.getElementById("instructions");
   if (instrBox.value === "") {
      instrBox.style.color = "rgb(178,184,183)";
      instrBox.value = instrBox.placeholder;
   }
}

/* add placeholder text for browsers that don't support placeholder attribute */
function generatePlaceholder() {
   if (!Modernizr.input.placeholder) {
      var instrBox = document.getElementById("instructions");
      instrBox.value = instrBox.placeholder;
      instrBox.style.color = "rgb(178,184,183)";
      if (instrBox.addEventListener) {
         instrBox.addEventListener("focus", zeroPlaceholder, false); 
         instrBox.addEventListener("blur", checkPlaceholder, false); 
      } else if (instrBox.attachEvent)  {
         instrBox.attachEvent("onfocus", zeroPlaceholder);
         instrBox.attachEvent("onblur", checkPlaceholder); 
      }
   }
}

/* validate required fields */
function validateRequired() {
   var inputElements = document.querySelectorAll("input[required]");
   var errorDiv = document.getElementById("errorMessage");
   var crustBoxes = document.getElementsByName("crust");
   var fieldsetValidity = true;
   var elementCount = inputElements.length;
   var currentElement;
   try {
      for (var i = 0; i < elementCount; i++) { 
         // validate all required input elements in fieldset
         currentElement = inputElements[i];
         if (currentElement.value === "") {
            currentElement.style.background = "rgb(255,233,233)";
            fieldsetValidity = false;
         } else {
            currentElement.style.background = "white";
         }
      }
      currentElement = document.querySelectorAll("select")[0]; 
      // validate state select element
      if (currentElement.selectedIndex === -1) {
         currentElement.style.border = "1px solid red";
         fieldsetValidity = false;
      } else {
         currentElement.style.border = "";
      }

      if (!crustBoxes[0].checked && !crustBoxes[1].checked) { 
         // verify that a crust is selected
         crustBoxes[0].style.outline = "1px solid red";
         crustBoxes[1].style.outline = "1px solid red";
         fieldsetValidity = false;
      } else {
         crustBoxes[0].style.outline = "";
         crustBoxes[1].style.outline = "";
      }

      if (fieldsetValidity === false) { 
           throw "Please complete all required fields.";
      } else {
         errorDiv.style.display = "none";
         errorDiv.innerHTML = "";
      }
   }
   catch(msg) {
      errorDiv.style.display = "block";
      errorDiv.innerHTML = msg; 
      formValidity = false;
   }
}

/* validate form */
function validateForm(evt) {
   if (evt.preventDefault) {
      evt.preventDefault(); // prevent form from submitting
   } else {
      evt.returnValue = false; // prevent form from submitting in IE8
   }
   formValidity = true; // reset value for revalidation
   validateRequired();
   if (formValidity === true) {
      document.getElementById("errorMessage").innerHTML = "";
      document.getElementById("errorMessage").style.display = "none";
      document.getElementsByTagName("form")[0].submit();
   } else {
      document.getElementById("errorMessage").innerHTML = "Please complete the highlighted fields.";
      document.getElementById("errorMessage").style.display = "block";
      scroll(0,0);
   }
} 

/* create event listeners  */
function createEventListeners() {
   var orderForm = document.getElementsByTagName("form")[0];
   if (orderForm.addEventListener) {
      orderForm.addEventListener("submit", validateForm, false);
   } else if (orderForm.attachEvent) {
      orderForm.attachEvent("onsubmit", validateForm);
   }
}

/* run initial form configuration functions */
function setUpPage() {
   removeSelectDefault();
   createEventListeners();
   generatePlaceholder();
}

/* run setup functions when page finishes loading */
if (window.addEventListener) {
   window.addEventListener("load", setUpPage, false);
} else if (window.attachEvent) {
   window.attachEvent("onload", setUpPage);
}