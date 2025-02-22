function time(){
    let currentDate= new Date();
    const date = currentDate.toLocaleDateString();  // e.g., "2/22/2025"
    let time = currentDate.toLocaleTimeString();

document.getElementById("date").innerHTML="Date:"+ date+" | Time: " +time;


}
setInterval(time, 1000);

