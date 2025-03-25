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

  // Display error if validation fails
  if (errorMessage) {
      document.getElementById("error").textContent = errorMessage;
      return;
  }

  // Prepare form data for submission
  const formData = {
      type: catRadio.checked ? 'cat' : 'dog',
      breed: breedChoice.value === 'doesntmatter' ? "Doesn't matter" : breedChoice.value,
      age: age.value === 'doesntmatter2' ? "Doesn't matter" : age.value,
      gender: dontcare.checked ? "Doesn't matter" : (femaleRadio.checked ? 'female' : 'male'),
      otherdogs: dogs.checked,
      othercats: cats.checked,
      smallchildren: children.checked
  };

  // Send data to server
  fetch('/find', {
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
  .then(html => {
      // Replace the current page content with the returned HTML
      document.open();
      document.write(html);
      document.close();
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById("error").textContent = 'An error occurred while searching for pets.';
  });
});