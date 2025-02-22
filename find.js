document.getElementById("form").addEventListener("submit", function(event){
    event.preventDefault();
    
    //checking radio button for cat or dog 
    let catRadio=document.getElementById("cat");
    let dogRadio=document.getElementById("dog");

    if (!(catRadio.checked || dogRadio.checked )){
        document.getElementById("error").innerHTML="Please fill the entire form";
    }

    //checking for breed choice
    let breedChoice= document.getElementById("breed");
    if (breedChoice.value===""){
        document.getElementById("error").innerHTML="Please fill the entire form";

    }

     //checking for age choice
     let age= document.getElementById("age");
     if (age.value===""){
         document.getElementById("error").innerHTML="Please fill the entire form";
 
     }

     //checking radio button gender
    let femaleRadio=document.getElementById("female");
    let maleRadio=document.getElementById("male");
    let dontcare=document.getElementById("dontcare");

    if (!(femaleRadio.checked || maleRadio.checked || dontcare.checked )){
        document.getElementById("error").innerHTML="Please fill the entire form !";
    }

    //checking for compatibility 
    let dogs=document.getElementById("dogs");
    let cats=document.getElementById("cats");
    let children=document.getElementById("children");

    if (!dogs.checked || !cats.checked || !children.checked) {
        document.getElementById("error").textContent = "Please fill the entire form.";
      }


})