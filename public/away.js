document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault();
  let errorMessage = "";

  // Validation checks
  let catRadio = document.getElementById("cat");
  let dogRadio = document.getElementById("dog");
  if (!catRadio.checked && !dogRadio.checked) {
      errorMessage = "Please select Cat or Dog.\n";
  }

  let breedChoice = document.getElementById("breed");
  if (breedChoice.value === "") {
      errorMessage += "Please select a breed.\n";
  }

  let age = document.getElementById("age");
  if (age.value === "") {
      errorMessage += "Please select an age.\n";
  }

  let femaleRadio = document.getElementById("female");
  let maleRadio = document.getElementById("male");
  if (!femaleRadio.checked && !maleRadio.checked) {
      errorMessage += "Please select a gender.\n";
  }

  let description = document.getElementById("description");
  if (description.value.trim() === "") {
      errorMessage += "Please tell us about your pet.\n";
  }

  let ownerName = document.getElementById("ownerName");
  if (ownerName.value.trim() === "") {
      errorMessage += "Please enter your name.\n";
  }

  let ownerEmail = document.getElementById("ownerEmail");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (ownerEmail.value.trim() === "") {
      errorMessage += "Please enter your email.\n";
  } else if (!emailRegex.test(ownerEmail.value.trim())) {
      errorMessage += "Please enter a valid email address.\n";
  }

  // Display error or submit form
  if (errorMessage) {
      document.getElementById("error").textContent = errorMessage;
      return;
  }

  // Prepare form data for submission
  const formData = {
      type: catRadio.checked ? 'cat' : 'dog',
      breed: breedChoice.value,
      age: age.value,
      gender: femaleRadio.checked ? 'female' : 'male',
      otherdogs: document.getElementById("dogs").checked,
      othercats: document.getElementById("cats").checked,
      smallchildren: document.getElementById("children").checked,
      description: description.value,
      ownerFirstName: ownerName.value.split(' ')[0],
      ownerLastName: ownerName.value.split(' ')[1] || '',
      ownerEmail: ownerEmail.value
  };

  // Send data to server
  fetch('/away', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.text();
  })
  .then(result => {
      document.getElementById("error").textContent = result;
      document.getElementById("form").reset(); // Clear form
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById("error").textContent = 'An error occurred while submitting the form.';
  });
});