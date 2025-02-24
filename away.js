document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Clear the error message initially
    let errorMessage = "";
  
    // Check radio buttons for Cat or Dog
    let catRadio = document.getElementById("cat");
    let dogRadio = document.getElementById("dog");
    if (!catRadio.checked && !dogRadio.checked) {
      errorMessage = "Please select Cat or Dog.\n";
    }
  
    // Check for breed choice
    let breedChoice = document.getElementById("breed");
    if (breedChoice.value === "") {
      errorMessage = "Please select a breed.\n";
    }
  
    // Check for age choice
    let age = document.getElementById("age");
    if (age.value === "") {
      errorMessage = "Please select an age.\n";
    }
  
    // Check radio buttons for gender
    let femaleRadio = document.getElementById("female");
    let maleRadio = document.getElementById("male");
    if (!femaleRadio.checked && !maleRadio.checked) {
      errorMessage = "Please select a gender.\n";
    }
  
    // Check for compatibility (checkboxes)
    let dogs = document.getElementById("dogs");
    let cats = document.getElementById("cats");
    let children = document.getElementById("children");
    if (!dogs.checked && !cats.checked && !children.checked) {
      errorMessage = "Please select at least one option for compatibility.\n";
    }
  

  // Check for description
  let description = document.getElementById("description");
  if (description.value.trim() === "") {
    errorMessage = "Please tell us about your pet.\n";
  }

  // Check for owner's name
  let ownerName = document.getElementById("ownerName");
  if (ownerName.value.trim() === "") {
    errorMessage = "Please enter your name.\n";
  }

  // Check for owner's email
  let ownerEmail = document.getElementById("ownerEmail");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
  if (ownerEmail.value.trim() === "") {
    errorMessage += "Please enter your email.\n";
  } else if (!emailRegex.test(ownerEmail.value.trim())) {
    errorMessage = "Please enter a valid email address.\n";
  }
  

    // Display the error message or success message
    if (errorMessage) {
        document.getElementById("error").textContent = errorMessage;
      } else {
        document.getElementById("error").textContent = "Thank you!";
      
      }

  });