function time(){
    let currentDate= new Date();
    const date = currentDate.toLocaleDateString();  
    let time = currentDate.toLocaleTimeString();

document.getElementById("date").innerHTML="Date:"+ date+" | Time: " +time;


}
setInterval(time, 1000);

