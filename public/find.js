document.getElementById("form").addEventListener("submit", function(event) {
    event.preventDefault();
  
    // Clear the error message initially
    let errorMessage = "";
  
    // Check radio buttons for Cat or Dog
    let catRadio = document.getElementById("cat");
    let dogRadio = document.getElementById("dog");
    if (!catRadio.checked && !dogRadio.checked) {
      errorMessage = "Please select Cat or Dog.";
    }
  
    // Check for breed choice
    let breedChoice = document.getElementById("breed");
    if (breedChoice.value === "") {
      errorMessage = "Please select a breed.";
    }
  
    // Check for age choice
    let age = document.getElementById("age");
    if (age.value === "") {
      errorMessage = "Please select an age.";
    }
  
    // Check radio buttons for gender
    let femaleRadio = document.getElementById("female");
    let maleRadio = document.getElementById("male");
    let dontcare = document.getElementById("dontcare");
    if (!femaleRadio.checked && !maleRadio.checked && !dontcare.checked) {
      errorMessage = "Please select a gender.";
    }
  
    // Check for compatibility (checkboxes)
    let dogs = document.getElementById("dogs");
    let cats = document.getElementById("cats");
    let children = document.getElementById("children");
    if (!dogs.checked && !cats.checked && !children.checked) {
      errorMessage = "Please select at least one option for compatibility.";
    }
  

    // Display the error message or success message
    if (errorMessage) {
        document.getElementById("error").textContent = errorMessage;
      } else {
        document.getElementById("error").textContent = "Thank you!";
      
      }

  });